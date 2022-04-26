let name_list = [
  'jakubferencik',
  'herbertlui',
  'markstarmach',
  'enriquedans',
  'jacquelinedooley',
  'jillfrancis',
  'juliovincentgambuto',
  'alexanderziperovich',
  'potluckzine',
  'dankadlec',
  'rebeccawmorris',
  'willleitch',
];
let creatorColumn = document.getElementById('creator');
let creator = ``;

for (let i = 0; i < name_list.length; i++) {
  let name = name_list[i];
  axios.get(`/api/1.0/creator/${name}`).then((res) => {
    let data = res.data;
    //follower count need to be fixed for supporter count, now is for fake data
    let { user_name, profile_pic, intro_post, user_page } = data;
    creator += `
    <div class="col-lg-4 col-md-12 mb-4">
    <div class="card">
      <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
        <img src="${profile_pic}" class="img-fluid" />
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
        </a>
      </div>
      <div class="card-body">
        <h5 class="card-title">${user_name}</h5>
        <p class="card-text">
          ${intro_post}
        </p>
        <a href="/creator/${user_page}" class="btn btn-warning">Visit</a>
      </div>
    </div>
  </div>
    `;
    creatorColumn.innerHTML = creator;
  });
}
