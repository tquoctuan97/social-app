import axios from 'axios';

export default class RegistrationForm {
  constructor() {
    this.form = document.querySelector('#registration-form');
    this.allField = document.querySelectorAll('#registration-form .form-group');
    this.username = document.querySelector('#username-register');
    this.username.previousValue = '';
    this.email = document.querySelector('#email-register');
    this.email.previousValue = '';
    this.password = document.querySelector('#password-register');
    this.password.previousValue = '';
    this.username.isUnique = false;
    this.email.isUnique = false;
    this.events();
    this.insertValidationElements();
  }

  // Events
  events() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.formSubmitHandler();
    });
    this.username.addEventListener('keyup', () => {
      this.isDifferent(this.username, this.usernameHandler);
    });
    this.email.addEventListener('keyup', () => {
      this.isDifferent(this.email, this.emailHandler);
    });
    this.password.addEventListener('keyup', () => {
      this.isDifferent(this.password, this.passwordHandler);
    });
    this.username.addEventListener('blur', () => {
      this.isDifferent(this.username, this.usernameHandler);
    });
    this.email.addEventListener('blur', () => {
      this.isDifferent(this.email, this.emailHandler);
    });
    this.password.addEventListener('blur', () => {
      this.isDifferent(this.password, this.passwordHandler);
    });
  }

  // Methods
  formSubmitHandler() {
    this.usernameImmediately();
    this.usernameAfterDelay();
    this.emailAfterDelay();
    this.passwordImmediately();
    this.passwordAfterDelay();

    if (
      this.username.isUnique &&
      !this.username.errors &&
      this.email.isUnique &&
      !this.email.errors &&
      !this.password.errors
    ) {
      this.form.submit();
    }
  }

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
            this.username.isUnique = false;
            this.showValidationError(this.username, 'That username is already being used');
          } else {
            this.username.isUnique = true;
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
            this.email.isUnique = false;
            this.showValidationError(this.email, 'That email is already being used');
          } else {
            this.email.isUnique = true;
            this.hideValidationError(this.email);
          }
        })
        .catch(() => {
          console.log('Please try again');
        });
    }
  }

  // Method Validation Password

  passwordHandler() {
    this.password.errors = false;
    this.passwordImmediately();
    clearTimeout(this.password.timer);
    this.password.timer = setTimeout(() => {
      this.passwordAfterDelay();
    }, 800);
  }

  passwordImmediately() {
    if (this.password.value.length > 50) {
      this.showValidationError(this.password, 'Password cannot exceed 50 characters.');
    }

    if (!this.password.errors) {
      this.hideValidationError(this.password);
    }
  }

  passwordAfterDelay() {
    if (this.password.value.length < 12) {
      this.showValidationError(this.password, 'Password must be at least 12 characters.');
    }
  }

  // Method Show/Hide Validation

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
