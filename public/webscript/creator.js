let creatorPath = window.location.pathname;
let pageName = creatorPath.replace('/creator/', '');
localStorage.setItem('creator_page', pageName);
let userToken = localStorage.getItem('token');

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
    .then((res) => {
      console.log(res.data);
    })
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
    .then((res) => {
      console.log(res.data);
    })
    .catch(function (err) {
      msg = err.data;
      alert(msg);
    });
}

axios
  .get(`/api/1.0${creatorPath}`)
  .then((res) => {
    let data = res.data;

    let {
      user_name,
      profile_pic,
      intro_post,
      about,
      follower_count,
      follower,
      post,
      popular,
      _id,
    } = data;

    let following;
    // check if user self and if following
    let user = localStorage.getItem('user_info');
    follower.forEach((follower) => {
      if (follower.follower_id == user) {
        following = true;
      } else {
        following = false;
      }
    });
    // console.log(following);

    if (user == _id) {
      document.getElementById('edit-page').style.display = 'block';
      document.getElementById('feat-follow').style.display = 'none';
      document.getElementById('feat-unfollow').style.display = 'none';
    } else if (following) {
      document.getElementById('edit-page').style.display = 'none';
      document.getElementById('feat-follow').style.display = 'none';
      document.getElementById('feat-unfollow').style.display = 'block';
    } else {
      document.getElementById('edit-page').style.display = 'none';
      document.getElementById('feat-follow').style.display = 'block';
      document.getElementById('feat-unfollow').style.display = 'none';
    }

    if (!follower_count) {
      follower_count = 0;
    }
    let profileColumn = document.getElementById('self-intro');
    let profilePic = document.getElementById('profile-pic');

    if (user == _id) {
      //only add when you are creator itself
      localStorage.setItem('profile_pic', profile_pic);
      localStorage.setItem('user_name', user_name);
      localStorage.setItem('page_name', pageName);
    }
    if (typeof intro_post == 'undefined') {
      intro_post = `Hello I am ${user_name}, Welcom to join me @buymeboba.today`;
    }
    let profile = `
    <h4 class="secondfont mb-1 font-weight-bold">${user_name}</h4>
		<p class="mb-3 pl-1">${about}</p>	
		<small class="text-muted pl-1">${follower_count} followers</small>
  `;
    profileColumn.innerHTML = profile;
    // let aboutColumn = document.getElementById('about');
    // let aboutMe = `<p class="card-text pr-5 pl-3">${intro_post}</p>`;
    // aboutColumn.innerHTML = aboutMe;

    let pic = `
  <a href="${creatorPath}">
   <img src="${profile_pic}" class = "rounded-circle" height="100"  width="100" pt-1/>
  </a>`;
    profilePic.innerHTML = pic;

    // support form
    let supportImg = document.getElementById('profile-basic');
    let supportContent = `
      <img src="${profile_pic}" id="profile-pic" alt="Avatar" class = "p-1 rounded-circle mx-auto d-block align-self-center avatar" height="95"  width="95" style="background-size:cover"/>
      <div id="support-line">	
      <h4 class="modal-title">Support <span class='font-weight-bold'>${user_name}</span>&nbsp&nbsp:)</h4>
      <button type="button" class="close mr-1 pr-1" data-dismiss="modal" aria-hidden="true" onclick='recoverForm()'>&times;</button>
      </div>`;
    supportImg.innerHTML = supportContent;

    let articleColumn = document.getElementById('article');
    let article = ``;

    //if no intro post
    console.log(intro_post);
    if (intro_post == '') {
      let pin = document.getElementById('pin-article');
      let pin_article = `<h2 class="mb-1 h4 font-weight-bold dark-blue">About Me</h2><p class="card-text pr-5 pl-3">${about}</p>`;
      pin.innerHTML = pin_article;
    }

    for (let i = 0; i < post.length; i++) {
      let {
        title,
        description,
        content,
        comment,
        like_count,
        create_time,
        _id,
        support_only,
      } = post[i];
      if (!description) {
        description = content.split('.')[0] + '.';
      }
      if (!like_count) {
        like_count = 0;
      }
      let d = new Date(create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      let commentCount = comment.length;

      //intro post to top and not in alll stories
      if (_id == intro_post) {
        let pin = document.getElementById('pin-article');
        let pin_article = ``;
        pin_article = `
        <div class="mb-3 d-flex justify-content-between" >
        <div class="pr-3 pt-2">
          <h2 class="mb-1 h4 font-weight-bold">
          <a class="dark-blue post-title" id=${_id} href='/article/${_id}'>${title}</a>
          </h2>
          <h5 class='text-muted ellipsis2'>${description}</h5>
          <div class="ellipsis5 pt-1 text-muted">${content}</div>
          <div class="card-text text-muted small pt-3">
            ${time}
          </div>
          <small class="text-muted">  💛 &nbsp; ${like_count} &middot; ${commentCount} comments</small>
        </div>
      </div>`;
        pin.innerHTML = pin_article;
        continue;
      }

      if (support_only == 1) {
        article += `
        <div class="mb-3 d-flex justify-content-between" >
          <div class="pr-3">
            <h2 class="mb-1 h4 font-weight-bold">
            <a class="text-dark post-title" id=${_id} href='/article/${_id}'>${title}</a>
            </h2>
            <span class="badge badge-pill badge-warning" id='support-only'>Support  Only</span>
            <p>
              ${description}
            </p>
            <div class="card-text text-muted small">
              ${time}
            </div>
            <small class="text-muted">  💛 &nbsp; ${like_count} &middot; ${commentCount} comments</small>
          </div>
        </div>
    `;
      } else {
        article += `
        <div class="mb-3 d-flex justify-content-between" >
          <div class="pr-3">
            <h2 class="mb-1 h4 font-weight-bold">
            <a class="text-dark post-title" id=${_id} href='/article/${_id}'>${title}</a>
            </h2>
            <p>
              ${description}
            </p>
            <div class="card-text text-muted small">
              ${time}
            </div>
            <small class="text-muted">  💛 &nbsp; ${like_count} &middot; ${commentCount} comments</small>
          </div>
        </div>
        `;
      }

      let popColumn = document.getElementById('pop-article');
      let pop = ``;

      for (let i = 0; i < popular.length; i++) {
        let popularPost = popular[i];
        let d = new Date(popularPost.create_time);
        let time =
          d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
        pop += `
      <li>
      <span>
      <h6 class="font-weight-bold">
      <a href="/article/${popularPost._id}" class="text-dark">${popularPost.title}</a>
      </h6>
      <p class="text-muted">
        ${time}
      </p>
      </span>
      </li>`;
      }
      popColumn.innerHTML = pop;
    }
    articleColumn.innerHTML = article;
  })
  .catch((error) => {
    console.log(error);
  });
