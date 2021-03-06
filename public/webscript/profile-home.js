let userId = localStorage.getItem('user_info');
let token = window.localStorage.getItem('token');

if (!token) {
  window.alert('please log in first!');
  window.location.href = '/index.html';
}

axios({
  method: 'post',
  url: '/api/1.0/newsfeed',
  data: {
    user_id: userId,
  },
})
  .then((res) => {
    let data = res.data;
    if (res.data.length == 0) {
      let reminder = document.getElementById('explore-more');
      let text = ``;
      text = `
      <p>Not following any creator yet? Explore more creators</p><a href='/creator-explore.html'><p>&nbsp HERE<p></a>
      `;
      reminder.innerHTML = text;
    }
    // let { comment, like_count, title, description, user, create_time } = data;
    let newsFeed = document.getElementById('news-feed');
    let feed = ``;
    for (let i = 0; i < data.length; i++) {
      let info = data[i];
      let d = new Date(info.create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      feed += `
      <div class="bg-white border mt-4 rounded shadow-sm">
        <a class="d-flex align-items-center p-3 border-bottom" href='/creator/${info.user.user_page}'>
            <img class="rounded-circle p-1" src=${info.user.profile_pic} style="width:45px; height:45px">
            <span class="font-weight-bold p-1">${info.user.user_name}</span>
        </a>
        <div class="p-2 px-3">
            <div class="mt-1 p-1">
                <span>${info.description}</span>
            </div>
            <div class="pt-4 p-1">
                <span class="font-weight-bold">${time}</span>
            </div>
            <div class="p-1">
                <a href='/article/${info._id}' class='h5'>${info.title}</a>
            </div>
            <div class="d-flex socials mt-1 mb-2 m-1">
                <small class="text-muted">  💛 &nbsp; ${info.like_count} &middot; ${info.comment} comment</small>
            </div>
        </div>
      </div>
      `;
    }
    newsFeed.innerHTML = feed;
  })
  .catch(function (error) {
    console.log(error);
  });

document.getElementById('post-search').addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    let serachTag = document.getElementById('post-search').value;
    axios({
      method: 'post',
      url: '/api/1.0/newsfeed/search',
      data: {
        tag: serachTag,
      },
    })
      .then((res) => {
        let data = res.data;
        if (res.data.length == 0) {
          let reminder = document.getElementById('explore-more');
          let text = ``;
          text = `
          <p class='text-primary'>No relative post, please search for other keyword  ლ(∘◕‵ƹ′◕ლ)<p>
          `;
          reminder.innerHTML = text;
        }
        // let { comment, like_count, title, description, user, create_time } = data;
        let newsFeed = document.getElementById('news-feed');
        let feed = ``;
        for (let i = 0; i < data.length; i++) {
          let info = data[i];
          let d = new Date(info.create_time);
          let time =
            d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
          feed += `
          <div class="bg-white border mt-4 rounded shadow-sm">
            <a class="d-flex align-items-center p-3 border-bottom" href='/creator/${info.user.user_page}'>
                <img class="rounded-circle p-1" src=${info.user.profile_pic} style="width:45px;height:45px">
                <span class="font-weight-bold p-1">${info.user.user_name}</span>
            </a>
            <div class="p-2 px-3">
                <div class="mt-1 p-1">
                    <span>${info.description}</span>
                </div>
                <div class="pt-4 p-1">
                    <span class="font-weight-bold">${time}</span>
                </div>
                <div class="p-1">
                    <a href='/article/${info._id}' class='h5'>${info.title}</a>
                </div>
                <div class="d-flex socials mt-1 mb-2 m-1">
                    <small class="text-muted">  💛 &nbsp; ${info.like_count} &middot; ${info.comment} comment</small>
                </div>
            </div>
          </div>
          `;
        }
        newsFeed.innerHTML = feed;
        document.getElementById('post-search').value = '';
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
