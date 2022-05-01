let userId = window.localStorage.getItem('user_info');

axios({
  method: 'post',
  url: '/api/1.0/chatroom',
  //API要求的資料
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
  // document.body.addEventListener('click', (e) => memberPic(e));
}

// function memberPic(e) {
//   if (e.target.closest('.chat-box').getAttribute('name') == 'chat-box') {
//     let memberPic = e.target.closest('.chat-box').id;
//     localStorage.setItem('member_pic',memberPic);
//   }
// }
