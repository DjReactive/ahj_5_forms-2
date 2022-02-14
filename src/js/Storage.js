export default class Storage {
  constructor(storage) {
    this.storage = storage;
  }
  save(saveObj) {
    this.storage.setItem('task', JSON.stringify(saveObj));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('task'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
