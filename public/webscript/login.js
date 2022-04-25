/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// let profileContent = `
//     <div id = 'profile_container'>
//         <h2>會員資料</h2>
//         <div id = 'profile_info'>
//             <div class='profile_column'>姓名:
//                 <span class='user' id = 'user_name'>
//             </div>
//             <div class='profile_column' >Email:
//                 <span class='user' id = 'user_email'>
//             </div>
//         </div>
//     </div>`;
console.log('yo');
let token = localStorage.getItem('token');
let user_info = localStorage.getItem('user_info');

if (!token) {
  document.getElementById('profile_view').innerHTML = ` 
        <div id = 'form_container'>
            </form>
            <form class='login_form' id = 'signin_form'>
            <h2> Welcome Back </h2>
            <div class='form_input'>
                <input type='text' id='sigin_email' placeholder=' email account'>
            </div>
            <div class='form_input'>
                <input type='password' id='signin_psw' placeholder=' password' autocomplete='on'>
            </div>
            <button class ='btn' id='signin_btn' type='button' onclick='log_in()'>Login</button>
            <br>
            <div id='signin_msg'></div>
            </form>
        </div>
        `;
}
//else導到creator page
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
    method: 'get',
    url: '/api/1.0/user/login',
    data: JSON.stringify(userInfo),
    headers: headers,
  })
    .then((res) => {
      let data = res.data.data;
      let token = data.access_token;
      let userInfo = data.user;
      let page_create = data.page_create;
      // console.log(userInfo);

      localStorage.setItem('token', token);
      localStorage.setItem('user_info', userInfo);
      if (page_create == '1') {
        window.location.href = 'creator.html';
      } else {
        window.location.href = `./complete-profile.html`;
      }
    })
    .catch(function (err) {
      msg = err.response.data.error;
      alert(msg);
    });
}
