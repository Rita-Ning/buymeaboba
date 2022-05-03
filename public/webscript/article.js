let articlePath = window.location.pathname;
let currentId = localStorage.getItem('user_info');
let currentName = localStorage.getItem('user_name');
let articleId = articlePath.split('/')[2];
let userToken = localStorage.getItem('token');

if (!userToken) {
  document.getElementById('my-profile').style.display = 'none';
} else {
  document.getElementById('my-profile').style.display = 'block';
}

// like Btn change and send back
function like() {
  if (!userToken) {
    window.location.href = '/signup.html';
    return;
  }
  axios.get(`/api/1.0${articlePath}`).then((res) => {
    let { like_count } = res.data;
    if (!like_count) {
      like_count = 0;
    }
    //like count +1, like solid
    let newLike = like_count + 1;
    document.getElementById(
      'likeBtn'
    ).innerHTML = `<a onclick="unlike()"><i class="fa-solid fa-heart fa-lg heart"></i><a> &nbsp ${newLike} `;
  });
  //send like back
  axios({
    method: 'post',
    url: '/api/1.0/like/add',
    data: {
      article_id: articleId,
      user_id: currentId,
      time: Date.now(),
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function unlike() {
  axios.get(`/api/1.0${articlePath}`).then((res) => {
    let { like_count } = res.data;
    if (!like_count) {
      like_count = 0;
    }
    //like count +1, like solid
    let newLike = like_count - 1;
    document.getElementById(
      'likeBtn'
    ).innerHTML = `<a onclick="like()"><i class="fa-regular fa-heart fa-lg"></i><a> &nbsp ${newLike} `;
  });

  //send unlike back
  axios({
    method: 'post',
    url: '/api/1.0/like/delete',
    data: {
      article_id: articleId,
      user_id: currentId,
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// if comment submit
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentColumn = document.getElementById('comment-box');

commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!userToken) {
    window.location.href = '/signup.html';
    return;
  }
  comment = commentInput.value;
  axios({
    method: 'post',
    url: '/api/1.0/comment/add',
    data: {
      article_id: articleId,
      user_id: currentId,
      user_name: currentName,
      comment_time: Date.now(),
      comment,
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  // show comment immediately
  let d = new Date(Date.now());
  let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
  let commentElement = document.createElement('div');
  commentNew = `
    <div class="pt-3">
      <div class="d-flex justify-content-left align-items-center">
          <p class="mb-0 text-muted">${currentName}</p>
          <small class="ml-4 text-muted">${time}</small>
      </div>
      <span class="mt-3">${comment}</span>
    </div>`;
  commentElement.innerHTML = commentNew;
  commentColumn.prepend(commentElement);

  // update comment number immediately
  axios.get(`/api/1.0/${articlePath}`).then((res) => {
    let { comment } = res.data;
    let newCount = comment.length + 1;
    document.getElementById(
      'commentBlock'
    ).innerHTML = `<i class="fa-regular fa-message fa-lg"></i> &nbsp ${newCount}`;
  });
  commentInput.value = '';
});

axios.get(`/api/1.0${articlePath}`).then((res) => {
  let data = res.data;
  //follower count need to be fixed for supporter count, now is for fake data
  let { content, user, popular, comment, liked_by, like_count, user_id } = data;
  let profileColumn = document.getElementById('self-intro');
  let profilePic = document.getElementById('profile-pic');
  let follower_count = user.follower_count;
  if (!follower_count) {
    follower_count = 0;
  }
  let profile = `
    <h4 class="secondfont mb-1 font-weight-bold">${user.user_name}</h4>
		<p class="mb-3 pl-1">${user.about}</p>	
		<small class="text-muted pl-1">${follower_count} followers</small>
  `;
  profileColumn.innerHTML = profile;

  let pic = `
  <a href="/creator/${user.user_page}">
  <img src="${user.profile_pic}" class = "rounded-circle" height="100"  width="100" pt-1/>
  </a>`;

  profilePic.innerHTML = pic;

  let articleColumn = document.getElementById('article-content');

  article = `
    ${content}
    `;

  articleColumn.innerHTML = article;

  // popular post at left-side
  let popColumn = document.getElementById('pop-article');
  let pop = ``;

  for (let i = 0; i < popular.length; i++) {
    let popularPost = popular[i];
    let d = new Date(popularPost.create_time);
    let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
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

  //comment section get hostory
  let commentColumn = document.getElementById('comment-box');
  let comments = ``;

  for (let i = 0; i < comment.length; i++) {
    let oneComment = comment[i];
    if (oneComment.comment == '') {
      continue;
    }
    let d = new Date(oneComment.comment_time);
    let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    comments += `
    <div class="pt-3">
      <div class="d-flex justify-content-left align-items-center">
          <p class="mb-0 text-muted">${oneComment.user_name}</p>
          <small class="ml-4 text-muted">${time}</small>
      </div>
      <span class="mt-3">${oneComment.comment}</span>
    </div>`;
  }
  commentColumn.innerHTML = comments;

  let following;
  user.follower.forEach((follow) => {
    if (follow.follower_id == currentId) {
      following = true;
    } else {
      following = false;
    }
  });

  //follow,following,edit auth setting
  if (currentId == user_id) {
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

  //check if user liked
  if (!like_count) {
    like_count = 0;
  }

  if (liked_by.length !== 0) {
    liked_by.forEach((element) => {
      let isLike = element.user_id.includes(currentId);

      if (isLike) {
        document.getElementById(
          'likeBtn'
        ).innerHTML = `<a onclick="unlike()"><i class="fa-solid fa-heart fa-lg heart"></i><a> &nbsp ${like_count} `;
      } else {
        document.getElementById(
          'likeBtn'
        ).innerHTML = `<a onclick="like()"><i class="fa-regular fa-heart fa-lg"></i><a> &nbsp ${like_count} `;
      }
    });
  } else {
    document.getElementById(
      'likeBtn'
    ).innerHTML = `<a onclick="like()"><i class="fa-regular fa-heart fa-lg"></i><a> &nbsp ${like_count} `;
  }
  // comment count
  document.getElementById(
    'commentBlock'
  ).innerHTML = `<i class="fa-regular fa-message fa-lg"></i> &nbsp ${comment.length}`;
});
