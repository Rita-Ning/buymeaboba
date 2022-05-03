let urlParams = new URLSearchParams(window.location.search);
let type = urlParams.get('type');
let userId = localStorage.getItem('user_info');

const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('send-all');
const messageInput = document.getElementById('message-input');

let typeBox = document.getElementById('type');
let typeText = ``;
typeText = `
<p class="mb-0 pl-5 font-weight-bold text-dark">${type}</p>`;
typeBox.innerHTML = typeText;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  message = messageInput.value;
  axios({
    method: 'post',
    url: '/api/1.0/chat/multiple-msg',
    data: {
      user_id: userId,
      type,
      msg: message,
    },
  })
    .then((res) => {
      console.log(res.data);
      alert('Your Message has sent out!');
    })
    .catch(function (error) {
      console.log(error);
    });
  messageInput.value = '';
});
