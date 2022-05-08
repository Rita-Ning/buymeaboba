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
    console.log(res.data);
    let { overview, earning_post, recent_post } = res.data;
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
      earn += `
      <tr>
          <th scope="row">${eCount}</th>
          <td>${time}</td>
          <td><a href = '/article/${ele._id}'>${ele.title}</td>
          <td>View</td>
          <td>${ele.earning_amount}</td>
          <td>${engagement}</td>
          <td>Member</td>
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
      recent += `
      <tr>
          <th scope="row">${rCount}</th>
          <td>${time}</td>
          <td><a href = '/article/${ele._id}'>${ele.title}</a></td>
          <td>View</td>
          <td>${ele.earning_amount}</td>
          <td>${engagement}</td>
          <td>Member</td>
      </tr>
      `;
    });
    recentPost.innerHTML = recent;
  })
  .catch(function (error) {
    console.log(error);
  });
