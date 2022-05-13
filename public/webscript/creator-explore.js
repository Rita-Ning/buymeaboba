//get category creators
axios.get(`/api/1.0/search`).then((res) => {
  let data = res.data;

  for (let i = 0; i < data.length; i++) {
    let choose = data[i];
    let creatorColumn = document.getElementById(`${choose.category}`);
    let creatorInfo = ``;
    for (let j = 0; j < 4; j++) {
      let creator = choose.creators[j];
      creatorInfo += `
      <div class="col-lg-3 col-md-12 mb-4 creator-box p-1">
      <div class="card border-0 bg-white pt-3 px-1 shadow-sm" >
        <a class="bg-image hover-overlay ripple" data-mdb-ripple-color="light" href='/creator/${creator.user_page}'>
          <div style="background-image:url(${creator.profile_pic})" class="img-fluid img-cover shadow-sm"></div>
        </a>
        <div class="card-body">
          <h5 class="card-title ellipsis1">${creator.user_name}</h5>
          <p class="card-text ellipsis2">
            ${creator.about}
          </p>
        </div>
      </div>
      </div>
      `;
      creatorColumn.innerHTML = creatorInfo;
    }
  }
});

function search() {
  document.getElementById('search').style.display = 'block';
  let searchText = document.getElementById('search-text').value;

  axios
    .get(`/api/1.0/search?keyword=${searchText}`)
    .then((res) => {
      let data = res.data;
      let searchColumn = document.getElementById('search-result');
      let result = ``;

      for (let i = 0; i < data.length; i++) {
        let creator = data[i];

        result += `
        <div class="col-lg-3 col-md-12 mb-4 creator-box p-1">
        <div class="card border-0" >
          <a class="bg-image hover-overlay ripple" data-mdb-ripple-color="light" href='/creator/${creator.user_page}'>
            <img src="${creator.profile_pic}" class="img-fluid bg-warning p-2 rounded-circle" style='width:200px;height:200px'/>
          </a>
          <div class="card-body">
            <h5 class="card-title ellipsis1">${creator.user_name}</h5>
            <p class="card-text ellipsis2">
              ${creator.about}
            </p>
          </div>
        </div>
        </div>
        `;
      }
      searchColumn.innerHTML = result;
    })
    .catch(function (err) {
      msg = err.response.data.error;
      alert(msg);
    });
}

document.getElementById('search-text').addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    document.getElementById('search-btn').click();
  }
});
