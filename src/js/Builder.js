import Validator from './Validator';

export default class Builder {
  constructor(storage) {
    this.storage = storage;
    this.items = [];
    this.counter = 0;
    this.body = document.querySelector('.body');
    this.widjet = document.querySelector('.widjet');
    this.button = document.getElementById('add-item');
    this.table = document.getElementById('table');

    //this.tableRows = this.table.querySelector('tr');
  }

  init() {
    this.button.addEventListener('click', () => this.createPopup());
    const load = this.storage.load();
    if (load) this.items = load.state;
    this.update();
  }

  update() {
    this.clearId();
    const tds = this.table.querySelectorAll('tr.item');
    Array.from(tds).forEach(td => td.remove());
    if (this.items.length < 1) {
      this.tableAddItem({
        information: true,
        name: 'Никаких товаров пока не добавлено'
      }, true);
    } else {
      this.items.forEach(item => this.tableAddItem(item, true));
    }
  }

  tableAddItem(itemObj, noPush = false) {
    const tr = document.createElement('tr');
    const itemId = this.generateId();
    tr.setAttribute('id', `item-id-${itemId}`);
    tr.setAttribute('class', 'item');
    tr.innerHTML = `<td ${(itemObj.information) ?
      'colspan=3 id="no-items"' : ''}>${itemObj.name}</td>`;

    if (!itemObj.information) {
      tr.innerHTML += `
        <td>${itemObj.price}</td>
        <td>
          <button id="edit-id-${itemId}">\u{270F}</button>
          <button id="remove-id-${itemId}">\u{274C}</button>
        </td>
      `;
      if (!noPush) this.items.push(itemObj);
    }
    this.table.appendChild(tr);
    this.setEventsOnButtons(itemId);
    this.storage.save({ state: this.items });
  }

  tableUpdateItem(id, itemObj) {
    this.getItem(id, 'edit', itemObj);
    this.storage.save({ state: this.items });
    this.update();
  }

  tableEditItem(id) {
    const item = this.getItem(id);
    this.createPopup(id);
  }

  tableRemoveItem(id) {
    this.getItem(id, 'remove'); // action - remove
    this.storage.save({ state: this.items });
    this.update();
  }

  setEventsOnButtons(itemId) {
    const edit = document.getElementById(`edit-id-${itemId}`);
    const remove = document.getElementById(`remove-id-${itemId}`);
    if (edit) edit.addEventListener('click', () => this.tableEditItem(itemId));
    if (remove) remove.addEventListener('click', () => this.tableRemoveItem(itemId));
  }

  generateId() {
    this.counter +=1;
    return this.counter;
  }

  clearId() {
    this.counter = 0;
  }

  getItem(id, action = '', obj = null) {
    const item = document.getElementById(`item-id-${id}`);
    if (!item) return null;

    const tds = item.querySelector(`td`);
    for (let item, i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item.name === tds.textContent) {
        switch (action) {
          case 'remove':
            this.items.splice(i, 1);
            break;
          case 'edit':
            this.items.splice(i, 1, obj);
            break;
          default:
            break;
        }
        return item;
      }
    }
    return null;
  }

  createPopup(itemId = null) {
    if (document.getElementById('modal-popup')) return;
    const popup = document.createElement('div');
    popup.setAttribute('id', 'modal-popup');
    popup.classList.add('popup');
    const item = this.getItem(itemId);
    const html = `
    <div class="label">
      <span>Название</span>
      <input id="name" type="text" value="${ (itemId) ? item.name : '' }">
      <span id="name-error" class="error"></span>
    </div>
    <div class="label">
      <span>Стоиомость</span>
      <input id="price" type="text" value="${ (itemId) ? item.price : '' }">
      <span id="price-error" class="error"></span>
    </div>`;

    popup.innerHTML += html;
    this.body.appendChild(popup);
    this.createButtons(popup, itemId);

    this.horCenterOnTarget(popup);
  }

  createButtons(popup, itemId = null) {
    // Добавляем кнопки
    const cancel = document.createElement('button');
    cancel.textContent = 'Закрыть';
    cancel.dataset.action = 'close';
    cancel.classList.add('button');
    cancel.addEventListener('click', () => popup.remove());
    popup.append(cancel);

    const save = document.createElement('button');
    save.textContent = 'Сохранить';
    save.dataset.action = 'save';
    save.classList.add('button');
    popup.append(save);

    if (itemId !== null) {
      save.addEventListener('click', () => {
        const itemName = document.getElementById('name');
        const itemPrice = document.getElementById('price');
        if (this.checkValidInputs(itemName.value, itemPrice.value)) {
          this.tableUpdateItem(itemId, {
            information: false,
            name: itemName.value,
            price: itemPrice.value,
          });
          popup.remove();
          this.update();
        }
      });
    } else {
      save.addEventListener('click', () => {
        const itemName = document.getElementById('name');
        const itemPrice = document.getElementById('price');
        if (this.checkValidInputs(itemName.value, itemPrice.value)) {
          this.tableAddItem({
            information: false,
            name: itemName.value,
            price: itemPrice.value,
          });
          popup.remove();
          this.update();
        }
      });
    }
  }

  checkValidInputs(name, value) {
    const errSpanName = document.getElementById('name-error');
    const errSpanPrice = document.getElementById('price-error');
    let validate = true;

    let response = Validator.validateString(this.items, name);
    if (response.error) {
      this.setErrorMessage(errSpanName, response.message);
      validate = false;
    } else this.setErrorMessage(errSpanName, '');

    response = Validator.validateNumber(value);
    if (response.error) {
      this.setErrorMessage(errSpanPrice, response.message);
      validate = false;
    } else this.setErrorMessage(errSpanPrice, '');

    return validate;
  }

  setErrorMessage(input, message) {
    input.textContent = message;
  }

  // Центрирует элемент popover относительно target
  horCenterOnTarget(el) {
    const { top, left } = this.widjet.getBoundingClientRect();
    el.style.left = `${window.scrollX + left +
      (Math.abs(el.offsetWidth - this.widjet.offsetWidth) / 2)}px`;
    el.style.top = `${window.scrollY + top +
      (Math.abs(el.offsetHeight - this.widjet.offsetHeight) / 2)}px`;
  }
}
