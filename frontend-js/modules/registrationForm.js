import axios from 'axios';

export default class RegistrationForm {
  constructor() {
    this.allField = document.querySelectorAll('#registration-form .form-group');
    this.username = document.querySelector('#username-register');
    this.username.previousValue = '';
    this.events();
    this.insertValidationElements();
  }

  // Events
  events() {
    this.username.addEventListener('keyup', () => {
      this.isDifferent(this.username, this.usernameHandler);
    });
  }

  // Methods
  isDifferent(el, handler) {
    if (el.value != el.previousValue) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }

  usernameHandler() {
    this.username.errors = false;
    this.usernameImmediately();
    clearTimeout(this.username.timer);
    this.username.timer = setTimeout(() => {
      this.usernameAfterDelay();
    }, 3000);
  }

  usernameImmediately() {
    if (this.username.value != '' && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
      this.showValidationError(this.username, 'Username only contain letters and numbers');
    }

    if (this.username.value.length > 30) {
      this.showValidationError(this.username, 'Username cannot exceed 30 characters.');
    }

    if (!this.username.errors) {
      this.hideValidationError(this.username);
    }
  }

  usernameAfterDelay() {
    if (this.username.value.length < 3) {
      this.showValidationError(this.username, 'Username must be at least 3 characters.');
    }

    if (!this.username.errors) {
      axios
        .post('/doesUsernameExist', {username: this.username.value})
        .then(() => {
          this.showValidationError(this.username, 'Username already exist');
          this.username.unique = false;
        })
        .catch(() => {
          this.hideValidationError(this.username);
          this.username.unique = true;
        });
    }
  }

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message;
    el.nextElementSibling.classList.add('liveValidateMessage--visible');
    el.errors = true;
  }

  hideValidationError(el) {
    el.nextElementSibling.classList.remove('liveValidateMessage--visible');
  }

  insertValidationElements() {
    this.allField.forEach((el) => {
      el.insertAdjacentHTML('beforeend', `<div class="alert alert-danger small liveValidateMessage"></div>`);
    });
  }
}
