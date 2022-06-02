let urlParams = new URLSearchParams(window.location.search);
let type = urlParams.get('type');
let userId = localStorage.getItem('user_info');
let token = window.localStorage.getItem('token');

if (!token) {
  window.alert('please log in first!');
  window.location.href = '/index.html';
}

const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('send-all');
const messageInput = document.getElementById('message-input');

let typeBox = document.getElementById('type');
let typeText = ``;
typeText = `
<p class="mb-0 font-weight-bold text-dark">&nbsp &nbsp${type}</p>`;
typeBox.innerHTML = typeText;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  message = messageInput.value;
  let emailCheck = document.getElementById('msg-email').checked;
  let sendEmail;
  if (emailCheck) {
    sendEmail = 1;
  } else {
    sendEmail = 0;
  }

  if (message == '') {
    Swal.fire({
      toast: true,
      position: 'top',
      iconColor: 'yellow',
      showConfirmButton: false,
      timer: 2000,
      icon: 'warning',
      text: 'Message cannot be blank!',
    });
    return;
  }
  axios({
    method: 'post',
    url: '/api/1.0/chat/multiple-msg',
    data: {
      user_id: userId,
      type,
      msg: message,
      send_email: sendEmail,
    },
  })
    .then((res) => {
      // console.log(res.data);
      Swal.fire({
        toast: true,
        position: 'top',
        iconColor: 'aqua',
        showConfirmButton: false,
        timer: 2000,
        icon: 'success',
        text: 'Message has sent out!',
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  messageInput.value = '';
});
