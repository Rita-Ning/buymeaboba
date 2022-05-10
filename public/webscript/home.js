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
            <img src="${creator.profile_pic}" class="img-fluid bg-warning p-2 rounded-circle" style='width:200px;height:200px'/>
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
