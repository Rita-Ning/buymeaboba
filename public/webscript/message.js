let urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get('roomid');
let memberId = urlParams.get('member');
let userId = localStorage.getItem('user_info');
let type = urlParams.get('type');

const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

var socket = io();

// get history msg
axios
  .get(`/api/1.0/chat/msg?roomid=${roomId}&member=${memberId}`)
  .then((res) => {
    // member profile setting
    let memberInfo = res.data.member;
    let chatMember = document.getElementById('chat-member');
    let member = ``;
    member = `
    <img class="rounded-circle flex-shrink-0" src="${memberInfo.profile_pic}" alt="" style="width: 30px; height: 30px;">
    <p class="mb-0 font-weight-bold text-dark">${memberInfo.user_name}</p>`;
    chatMember.innerHTML = member;

    let data = res.data.chatHistory;
    data.forEach((message) => {
      let d = new Date(message.date);
      let timeShow =
        d.getMonth() +
        1 +
        '/' +
        d.getDate() +
        ' ' +
        d.getHours() +
        ':' +
        d.getMinutes();
      sender = message.sender_name;
      text = message.msg;
      senderPic = message.sender_pic;
      appendMessage(`${sender}`, `${text}`, `${senderPic}`, `${timeShow}`);
    });
  })
  .then(() => {
    chatSocket();
  })
  .catch(function (error) {
    console.log(error);
  });

function chatSocket() {
  socket.emit('user-enter', roomId);

  socket.on('chat-message', (data) => {
    let d = new Date(data.time);
    let timeShow =
      d.getMonth() +
      1 +
      '/' +
      d.getDate() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes();
    // console.log(data);
    appendMessage(
      `${data.sender_name}`,
      `${data.msg}`,
      `${data.sender_pic}`,
      `${timeShow}`
    );
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    // console.log(user);
    socket.emit('send-chat-message', {
      message: message,
      sender: userId,
      roomId: roomId,
    });
    messageInput.value = '';
  });
}

function appendMessage(sender, message, pic, time) {
  const messageElement = document.createElement('div');
  let oneMsg = `
  <div class="d-flex align-items-center py-3">
    <img class="rounded-circle flex-shrink-0" src="${pic}" alt="" style="width: 40px; height: 40px;">
    <div class="w-100 ms-3">
        <div class="d-flex justify-content-between" style="width:180px">
            <h6 class="mb-0">${sender}</h6>
            <small class="ml-5">${time}</small>
        </div>
        <span class="mt-3">${message}</span>
    </div>
  </div>
  `;
  messageElement.innerHTML = oneMsg;
  messageContainer.append(messageElement);
}
