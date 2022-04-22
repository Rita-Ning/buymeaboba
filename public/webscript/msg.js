let roomId = window.localStorage.getItem('roomId');
let user = window.localStorage.getItem('name');

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

var socket = io();

// get history msg
axios
  .get(`/api/1.0/msg?roomid=${roomId}`)
  .then((res) => {
    let data = res.data;
    console.log(res.data);
    data.forEach((message) => {
      sender = message.sender;
      text = message.msg;
      appendMessage(`${sender}: ${text}`);
    });
  })
  .then(() => {
    other();
  })
  .catch(function (error) {
    console.log(error);
  });

function other() {
  socket.emit('user-enter', roomId);

  socket.on('chat-message', (data) => {
    console.log(data);
    appendMessage(`${data.sender}: ${data.message}`);
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    console.log(user);
    // appendMessage(`${user}: ${message}`);
    console.log(user);
    socket.emit('send-chat-message', {
      message: message,
      sender: user,
      roomId: roomId,
    });
    messageInput.value = '';
  });
}

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
