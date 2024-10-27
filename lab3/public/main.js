const socket = io();

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const emojiButton = document.getElementById('emoji-open-button');
const emojiPicker = document.getElementById('emoji-picker');

const messageTone = new Audio('/message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `В сети: ${data}`;
});

function sendMessage() {
  if (messageInput.value === '') return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit('message', data);
  addMessageToUI(true, data);
  messageInput.value = '';
}

socket.on('chat-message', (data) => {
  messageTone.play();
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const formattedTime = moment(data.dateTime).format('HH:mm:ss'); 
  const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${formattedTime}</span>
          </p>
        </li>
        `;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('input', () => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} печатает...`,
  });
});

socket.on('feedback', (data) => {
  clearFeedback();
  const feedbackElement = `
    <li class="feedback">
      ${data.feedback}
    </li>
  `;
  messageContainer.innerHTML += feedbackElement;
});

function clearFeedback() {
  const feedbackElements = document.querySelectorAll('.feedback');
  feedbackElements.forEach((element) => element.remove());
}

emojiButton.addEventListener('click', () => {
  if (emojiPicker.style.display === 'none') {
    emojiPicker.style.display = 'block';
  } else {
    emojiPicker.style.display = 'none';
  }
});

emojiPicker.addEventListener('emoji-click', (event) => {
  messageInput.value += event.detail.unicode;
  emojiPicker.style.display = 'none'; 
});



