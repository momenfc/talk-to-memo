window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

class Chat {
  chatContainer = document.querySelector('.chat-area');
  btnRecord = document.querySelector('.btn-record');
  btnSend = document.querySelector('.btn-send');
  inputMsg = document.querySelector('.input-msg');
  pesonMessage = '';
  robotMessage = '';
  isRecording = false;
  recognition = new window.SpeechRecognition();

  constructor(name) {
    this.name = name;

    this.btnSend.addEventListener('click', () => this.sendMsg());
    this.btnRecord.addEventListener('click', () => {
      if (this.isRecording) this.stopRecord();
      else this.startRecord();
    });
    this.recognition.addEventListener('result', ({ results }) => {
      const text = results[0][0].transcript;
      this.inputMsg.value = text;
      console.log(text);
    });
    this.recognition.addEventListener('end', () => {
      if (this.isRecording) this.recognition.start();
    });
    this.inputMsg.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this.sendMsg();
      }
    });

    this.welcomMsg();
  }

  startRecord() {
    this.isRecording = true;
    this.btnRecord.classList.add('active');
    this.recognition.interimResults = true;
    this.recognition.start();
  }
  stopRecord() {
    this.isRecording = false;
    this.btnRecord.classList.remove('active');
    this.recognition.interimResults = false;
    this.recognition.stop();
  }

  sendMsg() {
    this.pesonMessage = this.inputMsg.value.trim().toLowerCase();
    if (!this.pesonMessage) return;
    this.inputMsg.value = '';
    this.personMsg(this.pesonMessage);
    this.stopRecord();
    this.generateRobotMsg();
  }

  personMsg(message) {
    const output = `
    <div class="msg-box person">
        <div class="avatar">${this.name[0]}</div>
        <div class="text">${message}</div>
    </div>`;

    this.chatContainer.insertAdjacentHTML('beforeend', output);
  }

  rebotMsg(message, speak) {
    const output = `
    <div class="msg-box robot">
        <div class="avatar">
            <img src="assets/favicon.ico" alt="memo">
        </div>
    <div class="text">${message}</div>`;

    setTimeout(() => {
      if (!speak) this.setSynth();
      this.chatContainer.insertAdjacentHTML('beforeend', output);
    }, 1000);
  }

  generateRobotMsg() {
    if (this.pesonMessage.includes('what option')) {
      this.robotMessage = 'You can ask me any of these options';
      this.rebotMsg('hi memo, what is your name, what time now, open Youtube');
      return null;
    }
    if (this.pesonMessage.includes('hi')) {
      this.robotMessage = "I'm fine, thank you";
      this.rebotMsg(this.robotMessage);
      return null;
    }

    if (this.pesonMessage.includes('your name')) {
      this.robotMessage = 'my name is memo';
      this.rebotMsg(this.robotMessage);
      return null;
    }

    if (this.pesonMessage.includes('open youtube')) {
      this.robotMessage = 'opening youtube...';
      this.rebotMsg(this.robotMessage);
      window.open('https://youtube.com');
      return null;
    }

    if (this.pesonMessage.includes('what time')) {
      const { timeToRead, timeToShow } = getTime();
      this.robotMessage = timeToShow;
      this.rebotMsg(this.robotMessage, true);
      this.setSynth(timeToRead);
      return null;
    }

    this.robotMessage = `I am sorry ${this.name}. I do not understand what you say?`;
    this.rebotMsg(this.robotMessage);
  }

  setSynth(message) {
    const text = message || this.robotMessage;
    const synth = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(synth);
  }

  welcomMsg() {
    const msg = `Hello ${this.name}, I hope you are fine`;
    this.setSynth(msg);
    this.rebotMsg(msg);
  }
}

const modalEnterName = document.querySelector('.floating-box');
const inputName = document.querySelector('.input-name');
const btnStartChat = document.querySelector('.start-chat');

const startChatHandler = () => {
  const name = inputName.value;
  if (!name) return;
  modalEnterName.style.display = 'none';
  new Chat(name);
};
btnStartChat.addEventListener('click', startChatHandler);

inputName.addEventListener('keydown', e => {
  if (e.key === 'Enter') startChatHandler();
});

function getTime() {
  let currentDate = new Date();
  let timeToShow =
    currentDate.getHours() +
    ':' +
    currentDate.getMinutes() +
    ':' +
    currentDate.getSeconds();
  let timeToRead =
    "It's " +
    currentDate.getHours() +
    'and' +
    currentDate.getMinutes() +
    'minutes';

  return { timeToShow, timeToRead };
}
