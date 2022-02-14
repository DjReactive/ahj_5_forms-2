!function(){"use strict";class t{static validateString(e,s){if(s.length<3)return t.error("Слишком короткое название");if(s.length>24)return t.error("Слишком длинное название");for(let n=0;n<e.length;n++)if(e[n].name===s)return t.error("Такое название уже существует");return t.error()}static validateNumber(e){return e.length<1?t.error("Вы не ввели стоимость"):e.length>16?t.error("Слишком большое число"):/^[0-9]+$/.test(e)?Number(e)<=0?t.error("Стоимость должна быть выше 0"):t.error():t.error("Введите верное число")}static error(t=""){return t.length>0?{error:!0,message:t}:{error:!1}}}class e{constructor(t){this.storage=t,this.items=[],this.counter=0,this.body=document.querySelector(".body"),this.widjet=document.querySelector(".widjet"),this.button=document.getElementById("add-item"),this.table=document.getElementById("table")}init(){this.button.addEventListener("click",(()=>this.createPopup()));const t=this.storage.load();t&&(this.items=t.state),this.update()}update(){this.clearId();const t=this.table.querySelectorAll("tr.item");Array.from(t).forEach((t=>t.remove())),this.items.length<1?this.tableAddItem({information:!0,name:"Никаких товаров пока не добавлено"},!0):this.items.forEach((t=>this.tableAddItem(t,!0)))}tableAddItem(t,e=!1){const s=document.createElement("tr"),n=this.generateId();s.setAttribute("id",`item-id-${n}`),s.setAttribute("class","item"),s.innerHTML=`<td ${t.information?'colspan=3 id="no-items"':""}>${t.name}</td>`,t.information||(s.innerHTML+=`\n        <td>${t.price}</td>\n        <td>\n          <button id="edit-id-${n}">✏</button>\n          <button id="remove-id-${n}">❌</button>\n        </td>\n      `,e||this.items.push(t)),this.table.appendChild(s),this.setEventsOnButtons(n),this.storage.save({state:this.items})}tableUpdateItem(t,e){this.getItem(t,"edit",e),this.storage.save({state:this.items}),this.update()}tableEditItem(t){this.createPopup(t)}tableRemoveItem(t){this.getItem(t,"remove"),this.storage.save({state:this.items}),this.update()}setEventsOnButtons(t){const e=document.getElementById(`edit-id-${t}`),s=document.getElementById(`remove-id-${t}`);e&&e.addEventListener("click",(()=>this.tableEditItem(t))),s&&s.addEventListener("click",(()=>this.tableRemoveItem(t)))}generateId(){return this.counter+=1,this.counter}clearId(){this.counter=0}getItem(t,e="",s=null){const n=document.getElementById(`item-id-${t}`);if(!n)return null;const r=n.querySelector("td");for(let t,n=0;n<this.items.length;n++)if(t=this.items[n],t.name===r.textContent){switch(e){case"remove":this.items.splice(n,1);break;case"edit":this.items.splice(n,1,s)}return t}return null}createPopup(t=null){if(document.getElementById("modal-popup"))return;const e=document.createElement("div");e.setAttribute("id","modal-popup"),e.classList.add("popup");const s=this.getItem(t),n=`\n    <div class="label">\n      <span>Название</span>\n      <input id="name" type="text" value="${t?s.name:""}">\n      <span id="name-error" class="error"></span>\n    </div>\n    <div class="label">\n      <span>Стоиомость</span>\n      <input id="price" type="text" value="${t?s.price:""}">\n      <span id="price-error" class="error"></span>\n    </div>`;e.innerHTML+=n,this.body.appendChild(e),this.createButtons(e,t),this.horCenterOnTarget(e)}createButtons(t,e=null){const s=document.createElement("button");s.textContent="Закрыть",s.dataset.action="close",s.classList.add("button"),s.addEventListener("click",(()=>t.remove())),t.append(s);const n=document.createElement("button");n.textContent="Сохранить",n.dataset.action="save",n.classList.add("button"),t.append(n),null!==e?n.addEventListener("click",(()=>{const s=document.getElementById("name"),n=document.getElementById("price");this.checkValidInputs(s.value,n.value)&&(this.tableUpdateItem(e,{information:!1,name:s.value,price:n.value}),t.remove(),this.update())})):n.addEventListener("click",(()=>{const e=document.getElementById("name"),s=document.getElementById("price");this.checkValidInputs(e.value,s.value)&&(this.tableAddItem({information:!1,name:e.value,price:s.value}),t.remove(),this.update())}))}checkValidInputs(s,n){const r=document.getElementById("name-error"),i=document.getElementById("price-error");let a=!0,o=t.validateString(this.items,s);return o.error?(e.setErrorMessage(r,o.message),a=!1):e.setErrorMessage(r,""),o=t.validateNumber(n),o.error?(e.setErrorMessage(i,o.message),a=!1):e.setErrorMessage(i,""),a}static setErrorMessage(t,e){t.textContent=e}horCenterOnTarget(t){const{top:e,left:s}=this.widjet.getBoundingClientRect();t.style.left=`${window.scrollX+s+Math.abs(t.offsetWidth-this.widjet.offsetWidth)/2}px`,t.style.top=`${window.scrollY+e+Math.abs(t.offsetHeight-this.widjet.offsetHeight)/2}px`}}const s=localStorage,n=new class{constructor(t){this.storage=t}save(t){this.storage.setItem("task",JSON.stringify(t))}load(){try{return JSON.parse(this.storage.getItem("task"))}catch(t){throw new Error("Invalid state")}}}(s);new e(n).init()}();