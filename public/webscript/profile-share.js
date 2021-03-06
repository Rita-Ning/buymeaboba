let userName = localStorage.getItem('user_name');
let myProfile = localStorage.getItem('profile_pic');
let myPage = localStorage.getItem('page_name');

let leftbar = document.getElementById('leftbar-img');
let myInfo = `
<div class="position-relative">
<img class="rounded-circle" src="${myProfile}" alt="" style="width: 40px; height: 40px;">
<div class="rounded-circle bg-warning border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
</div>
<div class="ms-3">
<h6 class="mb-0">${userName}</h6>
</div>`;
leftbar.innerHTML = myInfo;

let navImg = document.getElementById('nav-img');
let myImg = ` <img class="rounded-circle me-lg-2" src="${myProfile}" alt="" style="width: 40px; height: 40px;">`;
navImg.innerHTML = myImg;

let toProfile = document.getElementById('menu-list');
let pagePath = `<a href="./creator/${myPage}" class="dropdown-item">View My Page</a>
                <a class="dropdown-item" href="/" onclick="logOut()">Log Out</a>`;
toProfile.innerHTML = pagePath;

function logOut() {
  localStorage.clear();
}
