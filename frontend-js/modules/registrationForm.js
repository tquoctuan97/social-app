import axios from 'axios';

export default class RegistrationForm {
  constructor() {
    this.allField = document.querySelectorAll('#registration-form .form-group');
    this.username = document.querySelector('#username-register');
    this.username.previousValue = '';
    this.email = document.querySelector('#email-register');
    this.email.previousValue = '';
    this.events();
    this.insertValidationElements();
  }

  // Events
  events() {
    this.username.addEventListener('keyup', () => {
      this.isDifferent(this.username, this.usernameHandler);
    });
    this.email.addEventListener('keyup', () => {
      this.isDifferent(this.email, this.emailHandler);
    });
  }

  // Methods
  isDifferent(el, handler) {
    if (el.value != el.previousValue) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }

  // Method Validation Username

  usernameHandler() {
    this.username.errors = false;
    this.usernameImmediately();
    clearTimeout(this.username.timer);
    this.username.timer = setTimeout(() => {
      this.usernameAfterDelay();
    }, 800);
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
        .then((response) => {
          if (response.data) {
            this.username.unique = false;
            this.showValidationError(this.username, 'That username is already being used');
          } else {
            this.username.unique = true;
            this.hideValidationError(this.username);
          }
        })
        .catch(() => {
          console.log('Please try again');
        });
    }
  }

  // Method Validation Email

  emailHandler() {
    this.email.errors = false;
    clearTimeout(this.email.timer);
    this.email.timer = setTimeout(() => this.emailAfterDelay(), 800);
  }

  emailAfterDelay() {
    if (!/\S+@\S+\.\S+/.test(this.email.value)) {
      this.showValidationError(this.email, 'You must provide a valid email address');
    }

    if (!this.email.errors) {
      axios
        .post('/doesEmailExist', {email: this.email.value})
        .then((response) => {
          if (response.data) {
            this.email.unique = false;
            this.showValidationError(this.email, 'That email is already being used');
          } else {
            this.email.unique = true;
            this.hideValidationError(this.email);
          }
        })
        .catch(() => {
          console.log('Please try again');
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
