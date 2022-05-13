let userPage = localStorage.getItem('page_name');

function btnYellow() {
  let column = document.getElementById('yellow-btn');
  let content = ``;
  content = `
  <div>
    <button type="button" class="btn-close float-end pe-3" aria-label="Close" onclick='yellowRecover()'></button>
  </div>
  <div class="row justify-content-center btn-img pt-5">
    <div class="rounded bg-dark text-white mb-5 me-5" id="btn-yellow-code">
    </div>
    <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm copyBtn" onclick="copyYellow()">Copy</button>
  </div>`;
  column.innerHTML = content;
  let yellowCode = document.getElementById('btn-yellow-code');
  yellowCode.innerText = `<a href="https://buymeboba.today/creator/${userPage}"><img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/yellowBtn.png"></a>`;
}

function btnBlack() {
  let column = document.getElementById('black-btn');
  let content = ``;
  content = `
  <div>
    <button type="button" class="btn-close float-end" aria-label="Close" onclick='blackRecover()'></button>
  </div>
  <div class="row justify-content-center btn-img pt-5">
    <div class="rounded bg-dark text-white mb-5 ms-5" id="btn-black-code">
    </div>
    <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm copyBtn" onclick="copyBlack()">Copy</button>
  </div>`;
  column.innerHTML = content;
  let blackCode = document.getElementById('btn-black-code');
  blackCode.innerText = `<a href="https://buymeboba.today/creator/${userPage}"><img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/blackBtn.png"></a>`;
}

function blackRecover() {
  let column = document.getElementById('black-btn');
  let content = ``;
  content = `
  <img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/blackBtn.png" class="btn-img p-5">
  <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm" onclick="btnBlack()">Generate now</button>`;
  column.innerHTML = content;
}

function yellowRecover() {
  let column = document.getElementById('yellow-btn');
  let content = ``;
  content = `
  <img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/yellowBtn.png" class="btn-img p-5">
  <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm" onclick="btnYellow()">Generate now</button>`;
  column.innerHTML = content;
}

function copyYellow() {
  let copyText = document.getElementById('btn-yellow-code').innerText;
  var myTemporaryInputElement = document.createElement('input');
  myTemporaryInputElement.type = 'text';
  myTemporaryInputElement.value = copyText;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand('Copy');

  document.body.removeChild(myTemporaryInputElement);
}

function copyBlack() {
  let copyText = document.getElementById('btn-black-code').innerText;
  var myTemporaryInputElement = document.createElement('input');
  myTemporaryInputElement.type = 'text';
  myTemporaryInputElement.value = copyText;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand('Copy');

  document.body.removeChild(myTemporaryInputElement);
}
