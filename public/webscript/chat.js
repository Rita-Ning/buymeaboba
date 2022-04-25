// const axios = require('axios');

const name = prompt('What is your name?');
window.localStorage.setItem('name', name);

axios({
  method: 'post',
  url: '/api/1.0/chatroom/users',
  //API要求的資料
  data: {
    name: name,
  },
})
  .then((res) => createChatroom(res))
  .catch(function (error) {
    console.log(error);
  });

function createChatroom(res) {
  const chat = document.getElementById('chat-container');
  let data = res.data;
  let chatDetail = '';

  data.forEach((room) => {
    let { chatWith, lastMsg, time, roomId } = room;
    localTime = new Date(time);

    chatDetail += `
    <div class="chat-box row mb-1 bg-light w-50 mx-auto" id = '${roomId}' name='chat-box'>
      <div id="chat-time" class ="text-muted">${localTime}</div>
      <div id = "username" class ="fs-5">${chatWith}</div>
      <div id="msg">${lastMsg}</div>
    </div>`;
  });
  chat.innerHTML = chatDetail;

  document.body.addEventListener('click', (e) => getRoom(e));
}

function getRoom(e) {
  if (e.target.closest('.chat-box').getAttribute('name') == 'chat-box') {
    let roomId = e.target.closest('.chat-box').id;
    // window.localStorage.setItem('roomId', roomId);
    window.location.href = `./msg.html?roomid=${roomId}`;
  }
}
