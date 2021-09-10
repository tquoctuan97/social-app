export default class Search {
  // Select DOM
  constructor() {
    this.openedYet = false;
    this.chatWapper = document.querySelector('#chat-wrapper');
    this.openIcon = document.querySelector('.header-chat-icon');
    this.injectHTML();
    this.closeIcon = document.querySelector('.chat-title-bar-close');
    this.events();
  }
  // Events
  events() {
    this.openIcon.addEventListener('click', (e) => {
      e.preventDefault;
      this.toggleChat();
    });
    this.closeIcon.addEventListener('click', () => {
      this.hideChat();
    });
  }

  // Methods
  hideChat() {
    this.chatWapper.classList.remove('chat--visible');
  }

  toggleChat() {
    if (!this.openedYet) {
      this.openConnection();
    }
    this.openedYet = true;
    this.chatWapper.classList.toggle('chat--visible');
  }

  openConnection() {
    alert('Running Open');
  }

  injectHTML() {
    this.chatWapper.innerHTML = `<div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
    <div id="chat" class="chat-log"></div>
    <form id="chatForm" class="chat-form border-top">
      <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>`;
  }
}
