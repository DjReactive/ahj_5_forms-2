import Builder from './Builder';
import Storage from './Storage';
let data = localStorage;
const storage = new Storage(data);
const builder = new Builder(storage);

builder.init();
