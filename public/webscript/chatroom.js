let userId = window.localStorage.getItem('user_info');
let token = window.localStorage.getItem('token');

if (!token) {
  window.alert('please log in first!');
  window.location.href = '/index.html';
}

let chatroomPage = document.getElementById('chatroom-box');
let sendForm = document.getElementById('newMsg-box');

async function newMsg() {
  chatroomPage.style.display = 'none';
  sendForm.style.display = 'block';
}

async function toChatRoom() {
  chatroomPage.style.display = 'block';
  sendForm.style.display = 'none';
}

axios({
  method: 'post',
  url: '/api/1.0/chat/chatroom',
  data: {
    user_id: userId,
  },
})
  .then((res) => showChatroom(res))
  .catch(function (error) {
    console.log(error);
  });

function showChatroom(res) {
  const chat = document.getElementById('chat-container');
  let data = res.data;
  data.sort(function (a, b) {
    var c = new Date(a.time);
    var d = new Date(b.time);
    return d - c;
  });

  let chatDetail = '';

  data.forEach((room) => {
    let { chatWith, lastMsg, time, roomId, memberImg, memberId } = room;
    let d = new Date(time);
    let timeShow =
      d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    if (memberImg != '') {
      img = memberImg;
    } else {
      img = './images/logo.jpeg';
    }

    chatDetail += `
    <a class="d-flex align-items-center border-bottom py-3 pt-4 chat-box" name='chat-box' href = './message.html?roomid=${roomId}&member=${memberId}'>
        <img class="rounded-circle flex-shrink-0 border border-white" src="${img}" alt="" style="width: 40px; height: 40px;">
        <div class="w-100 ms-3">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-0">${chatWith}</h6>
                <small class='text text-secondary'>${timeShow}</small>
            </div>
            <span class='text text-secondary'>${lastMsg}</span>
        </div>
    </a>`;

    chat.innerHTML = chatDetail;
  });
}

axios({
  method: 'post',
  url: '/api/1.0/chat/member',
  data: {
    user_id: userId,
  },
})
  .then((res) => showMember(res))
  .catch(function (error) {
    console.log(error);
  });

function showMember(res) {
  const chat = document.getElementById('chat-container');
  let data = res.data;
  let followerCount = data.follower_count;
  let supporterCount = data.supporter_count;
  document.getElementById('follower-count').innerHTML = `
    <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-0">Followers</h6>
        <a class="btn-sm btn-warning rounded-pill text-white" href='./message-multiple.html?type=follow'>Message</a>
    </div>
    <span>${followerCount}</span>`;
  document.getElementById('supporter-count').innerHTML = `
    <div class="d-flex w-100 justify-content-between">
      <h6 class="mb-0">Supporters <small> (only supporters that are members can get message)</small></h6>
      <a class="btn-sm btn-warning rounded-pill text-white" href='./message-multiple.html?type=support'>Message</a>
    </div>
    <span>${supporterCount}</span>`;
}
