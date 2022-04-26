let creatorPath = window.location.pathname;

axios.get(`/api/1.0/${creatorPath}`).then((res) => {
  let data = res.data;
  //follower count need to be fixed for supporter count, now is for fake data
  let { user_name, profile_pic, intro_post, about, follower_count, post } =
    data;
  if (!follower_count) {
    follower_count = 0;
  }
  let profileColumn = document.getElementById('self-intro');
  let profilePic = document.getElementById('profile-pic');
  let profile = `
    <h4 class="secondfont mb-1 font-weight-bold">${user_name}</h4>
		<p class="mb-3 pl-1">${about}</p>	
		<small class="text-muted pl-1">${follower_count} followers</small>
  `;
  profileColumn.innerHTML = profile;
  let aboutColumn = document.getElementById('about');
  let aboutMe = `<p class="card-text pr-5 pl-3">${intro_post}</p>`;
  aboutColumn.innerHTML = aboutMe;

  let pic = `
  <a href="/${creatorPath}">
   <img src="${profile_pic}" class = "rounded-circle" height="100"  width="100" pt-1/>
  </a>`;
  profilePic.innerHTML = pic;

  let articleColumn = document.getElementById('article');
  let article = ``;
  //like_count should be change, this is for fake data
  post.forEach((data) => {
    let {
      title,
      description,
      content,
      comment,
      like_count,
      create_time,
      liked_by,
      _id,
    } = data;
    if (!description) {
      description = content.split('.')[0] + '.';
    }
    if (!like_count) {
      like_count = 0;
    }
    let d = new Date(create_time);
    let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    let commentCount = comment.length;

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
  });

  articleColumn.innerHTML = article;
});
