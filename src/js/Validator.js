export default class Validator {
  static validateString(array, name) {
    if (name.length < 3) return Validator.error('Слишком короткое название');
    if (name.length > 24) return Validator.error('Слишком длинное название');
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === name)
        return Validator.error('Такое название уже существует');
    }
    return Validator.error();
  }

  static validateNumber(value) {
    if (value.length < 1) return Validator.error('Вы не ввели стоимость');
    if (value.length > 16) return Validator.error('Слишком большое число');
    if (!/^[0-9]+$/.test(value)) return Validator.error('Введите верное число');
    if (Number(value) <= 0) return Validator.error('Стоимость должна быть выше 0');

    return Validator.error();
  }

  static error(message = '') {
    if (message.length > 0) return {
      error: true,
      message,
    }
    return {
      error: false,
    }
  }
}
