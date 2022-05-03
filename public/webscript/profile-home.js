let userId = localStorage.getItem('user_info');

axios({
  method: 'post',
  url: '/api/1.0/newsfeed',
  data: {
    user_id: userId,
  },
})
  .then((res) => {
    let data = res.data;
    // let { comment, like_count, title, description, user, create_time } = data;
    let newsFeed = document.getElementById('news-feed');
    let feed = ``;
    for (let i = 0; i < data.length; i++) {
      let info = data[i];
      let d = new Date(info.create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      feed += `
      <div class="bg-white border mt-4 rounded shadow-sm">
        <div class="d-flex align-items-center p-3 border-bottom">
            <img class="rounded-circle p-1" src=${info.user.profile_pic} width="45">
            <span class="font-weight-bold p-1">${info.user.user_name}</span>
        </div>
        <div class="p-2 px-3">
            <div class="mt-1 p-1">
                <span>${info.description}</span>
            </div>
            <div class="pt-4 p-1">
                <span class="font-weight-bold">${time}</span>
            </div>
            <div class="p-1">
                <h5>${info.title}</h5>
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
