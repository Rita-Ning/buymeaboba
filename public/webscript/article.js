let articlePath = window.location.pathname;

axios.get(`/api/1.0/${articlePath}`).then((res) => {
  let data = res.data;
  //follower count need to be fixed for supporter count, now is for fake data
  let { content, user, popular } = data;
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
    <a href="./article.html" class="text-dark">${popularPost.title}</a>
    </h6>
    <p class="text-muted">
      ${time}
    </p>
    </span>
    </li>`;
  }
  popColumn.innerHTML = pop;
});
