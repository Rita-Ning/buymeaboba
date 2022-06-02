let creatorPath = window.location.pathname;
//check if login
if (!userToken) {
  document.getElementById('my-profile').style.display = 'none';
} else {
  document.getElementById('my-profile').style.display = 'block';
}

//follow function
function follow() {
  // if not login -> signup
  if (!userToken) {
    window.location.href = '/signup.html';
    return;
  }
  let following_name = creatorPath.split('/')[2];
  let user = localStorage.getItem('user_info');
  let followInfo = {
    follower_id: user,
    following_name,
  };
  document.getElementById('feat-follow').style.display = 'none';
  document.getElementById('feat-unfollow').style.display = 'block';
  axios({
    method: 'post',
    url: '/api/1.0/follow/add',
    data: JSON.stringify(followInfo),
    headers: { 'Content-Type': 'application/json' },
  })
    // .then((res) => {
    //   console.log(res.data);
    // })
    .catch(function (err) {
      msg = err.data;
      alert(msg);
    });
}

function unfollow() {
  let unfollowing_name = creatorPath.split('/')[2];
  let user = localStorage.getItem('user_info');
  let unfollowInfo = {
    unfollower_id: user,
    unfollowing_name,
  };
  document.getElementById('feat-follow').style.display = 'block';
  document.getElementById('feat-unfollow').style.display = 'none';
  axios({
    method: 'post',
    url: '/api/1.0/follow/delete',
    data: JSON.stringify(unfollowInfo),
    headers: { 'Content-Type': 'application/json' },
  })
    // .then((res) => {
    //   console.log(res.data);
    // })
    .catch(function (err) {
      msg = err.data;
      alert(msg);
    });
}
