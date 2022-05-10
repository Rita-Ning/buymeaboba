let userId = localStorage.getItem('user_info');

axios({
  method: 'post',
  url: '/api/1.0/dashboard/normal',
  data: {
    user_id: userId,
  },
  header: { 'Content-Type': 'application/json' },
})
  .then((res) => {
    let { overview, earning_post, recent_post, summary_page, tags } = res.data;
    console.log(summary_page);
    let pageSummary = document.getElementById('page-summary');
    let summary = ``;
    summary = `
    <div class="row bg-light ms-3 mb-0 rounded">
        <div class="col-sm-6 col-xl-4 border border-muted border-start-0 border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Followers</p>
                    <h6 class="mb-0">${summary_page.follower_count}</h6>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-xl-4 border border-muted border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Supporters</p>
                    <h6 class="mb-0">${summary_page.supporter}</h6>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-xl-4 border border-muted border-end-0 border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Earnings</p>
                    <h6 class="mb-0">$${summary_page.earnings}</h6>
                </div>
            </div>
        </div>
    </div>
    <div class="row bg-light ms-3 mt-0">
        <div class="col-sm-6 col-xl-4 border border-muted border-start-0 border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Page View</p>
                    <h6 class="mb-0">${summary_page.view}</h6>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-xl-4 border border-muted border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Page Engagement</p>
                    <h6 class="mb-0">${summary_page.engagement}</h6>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-xl-4 border border-muted border-end-0 border-top-0">
            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <div class="ms-3">
                    <p class="mb-2">Page Likes</p>
                    <h6 class="mb-0">${summary_page.like}</h6>
                </div>
            </div>
        </div>
    </div>`;
    pageSummary.innerHTML = summary;
    let overviewBox = document.getElementById('overview-box');
    let content = `
    <div class="col-sm-6 col-xl-4 border-end border-muted">
      <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
          <div class="ms-3 align-item-center">
              <p class="mb-2">Followers  </p>
              <h6 class="mb-0"><i class="fa-solid fa-users"></i> &nbsp ${overview.followers}</h6>
          </div>
      </div>
    </div>
    <div class="col-sm-6 col-xl-4 border-end border-muted">
        <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
            <div class="ms-3">
                <p class="mb-2">Supporters</p>
                <h6 class="mb-0"><i class="fa fa-beer-mug-empty"></i> &nbsp ${overview.supporters}</h6>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-4">
        <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
            <div class="ms-3">
                <p class="mb-2">Earnings</p>
                <h6 class="mb-0">$ &nbsp ${overview.earnings}</h6>
            </div>
        </div>
    </div>`;
    overviewBox.innerHTML = content;
    let earnPost = document.getElementById('earn-column');
    let earn = ``;
    let eCount = 0;

    earning_post.forEach((ele) => {
      let d = new Date(ele.create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      eCount += 1;
      let engagement = ele.like_count + ele.comment[0] + ele.earning_from[0];
      if (!ele.earning_amount) {
        ele.earning_amount = 0;
      }
      earn += `
      <tr>
          <th scope="row">${eCount}</th>
          <td>${time}</td>
          <td><a href = '/article/${ele._id}'>${ele.title}</td>
          <td>${ele.view}</td>
          <td>$${ele.earning_amount}</td>
          <td>${engagement}</td>
      </tr>
      `;
    });
    earnPost.innerHTML = earn;

    let recentPost = document.getElementById('recent-column');
    let recent = ``;
    let rCount = 0;

    recent_post.forEach((ele) => {
      let d = new Date(ele.create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      rCount += 1;
      let engagement = ele.like_count + ele.comment[0] + ele.earning_from[0];
      if (!ele.earning_amount) {
        ele.earning_amount = 0;
      }
      recent += `
      <tr>
          <th scope="row">${rCount}</th>
          <td>${time}</td>
          <td><a href = '/article/${ele._id}'>${ele.title}</a></td>
          <td>${ele.view}</td>
          <td>$${ele.earning_amount}</td>
          <td>${engagement}</td>
      </tr>
      `;
    });
    recentPost.innerHTML = recent;

    let topTag = document.getElementById('top-tag');
    let tag = ``;
    for (let i = 0; i < tags.length; i++) {
      tag += `
      <span class="badge bg-warning">${tags[i]}</span>`;
    }
    topTag.innerHTML = tag;
  })
  .catch(function (error) {
    console.log(error);
  });
