console.log('Hi');

let token = localStorage.getItem('token');

if (!token) {
  document.getElementById('profile_view').innerHTML = ` 
        <div id = 'form_container'>
            <form class='login_form' id = 'signup_form'>
                <h2> Sign Up </h2>
                <div class='form_input'>
                    <input type='text'  id='signup_email' placeholder=' email'>
                </div>
                <div class='form_input'>
                    <input type='password' id='signup_psw' placeholder=' password' autocomplete='on'>
                </div>
                <button class ='btn' id='signup_btn' type='button' onclick='sign_up()'>Register</button>
                <br>
                <div id='signup_msg'></div>
            </form>
        </div>
        `;
}
// else {
//   axios({
//     method: 'get',
//     url: '/api/1.0/user/profile',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       console.log(res.data.admin);
//       let data = res.data.userJson.data;
//       document.getElementById('profile_view').innerHTML = profileContent;
//       document.getElementById('user_name').innerHTML = data.name;
//       document.getElementById('user_email').innerHTML = data.email;
//     })
//     .catch(function (err) {
//       let msg = err.response.data.error;
//       document.getElementById('profile_view').innerHTML = msg;
//       localStorage.removeItem('token');
//     });
// }

function sign_up() {
  let email = document.getElementById('signup_email').value;
  let password = document.getElementById('signup_psw').value;

  let headers = { 'Content-Type': 'application/json' };
  let userInfo = {
    provider: 'native',
    email: email,
    password: password,
  };

  axios({
    method: 'post',
    url: '/api/1.0/user/signup',
    data: JSON.stringify(userInfo),
    headers: headers,
  })
    .then((res) => {
      let data = res.data.data;
      let token = data.access_token;
      let userInfo = data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('user_info', userInfo);
      window.location.href = `./complete-profile.html`;
    })
    .catch(function (err) {
      msg = err.response.data.err;
      alert(msg);
    });
}
