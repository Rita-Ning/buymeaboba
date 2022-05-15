let token = localStorage.getItem('token');
let myPage = localStorage.getItem('page_name');

if (token) {
  let navShow = document.getElementById('nav-show');
  let nav = `
  <li class="nav-item"><a href="./creator-explore.html" class="nav-link">Explore Creator</a></li>
  <li class="nav-item"><a href="/creator/${myPage}" class="nav-link" id="login-btn">My Page</a></li>`;
  navShow.innerHTML = nav;
}

axios
  .get(`/api/1.0/search/frontpage`)
  .then((res) => {
    let data = res.data;
    let recommandhColumn = document.getElementById('recommand-box');
    let result = ``;

    for (let i = 0; i < data.length; i++) {
      let creator = data[i];

      result += `
        <div class="col-lg-3 col-md-12 mb-4 creator-box p-1">
        <a class="card border-0" href='/creator/${creator.user_page}'>
          <div class="bg-image bg-yellow hover-overlay ripple" data-mdb-ripple-color="light">
            <div style="background-image:url(${creator.profile_pic})" class="img-fluid img-cover"></div>
          </div>
          <div class="card-body bg-yellow">
            <h5 class="card-title ellipsis1 font-weight-bold">${creator.user_name}</h5>
            <p class="card-text ellipsis2 text-dark">
              ${creator.about}
            </p>
          </div>
        </a>
        </div>
        `;
    }
    recommandhColumn.innerHTML = result;
  })
  .catch(function (err) {
    msg = err.response.data.error;
    alert(msg);
  });
