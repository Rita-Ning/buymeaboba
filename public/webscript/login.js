let token = localStorage.getItem('token');
let user_info = localStorage.getItem('user_info');

if (!token) {
  document.getElementById('profile_view').innerHTML = ` 
        <div id = 'form_container'>
            </form>
            <form class='login_form' id = 'signin_form'>
            <h2> Welcome Back </h2>
            <div class='form_input'>
                <input type='text' id='sigin_email' placeholder=' email account' value='test@test.com'>
            </div>
            <div class='form_input'>
                <input type='password' id='signin_psw' placeholder=' password' autocomplete='on' value='test333'>
            </div>
            <button class ='btn' id='signin_btn' type='button' onclick='log_in()'>Login</button>
            <br>
            <div id='signin_msg'></div>
            </form>
        </div>
        `;
} else {
  let user_id = localStorage.getItem('user_info');
  axios({
    method: 'get',
    url: `/api/1.0/creator?id=${user_id}`,
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      window.location.href = `./creator/${res.data.user_page}`;
    })
    .catch(function (err) {
      let msg = err.response.data.err;
      alert(msg);
    });
}

function log_in() {
  let email = document.getElementById('sigin_email').value;
  let password = document.getElementById('signin_psw').value;

  let headers = { 'Content-Type': 'application/json' };
  let userInfo = {
    provider: 'native',
    email: email,
    password: password,
  };
  axios({
    method: 'post',
    url: '/api/1.0/user/login',
    data: JSON.stringify(userInfo),
    headers: headers,
  })
    .then((res) => {
      let data = res.data.data;
      let token = data.access_token;
      let userInfo = data.user;
      let page_create = data.page_create;
      let user_page = data.user_page;
      // console.log(userInfo);

      localStorage.setItem('token', token);
      localStorage.setItem('user_info', userInfo);
      if (page_create == '1') {
        window.location.href = `/creator/${user_page}`;
      } else {
        window.location.href = `./complete-profile.html`;
      }
    })
    .catch(function (err) {
      console.log(err);
      msg = err.response.data.error;
      alert(msg);
    });
}
