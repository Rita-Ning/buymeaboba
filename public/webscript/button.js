let userPage = localStorage.getItem('page_name');

function btnYellow(size) {
  let style;
  if (size == 'lg') {
    style = 'width: 430px';
  } else if (size == 'md') {
    style = 'width: 350px';
  } else if (size == 'sm') {
    style = 'width: 270px';
  }
  let column = document.getElementById(`yellow-btn-${size}`);
  let content = ``;
  content = `
  <div>
    <button type="button" class="btn-close float-end pe-3" aria-label="Close" onclick="yellowRecover('${size}')"></button>
  </div>
  <div class="row justify-content-center btn-img pt-5">
    <div class="rounded bg-dark text-white mb-5 me-5" id="btn-yellow-code-${size}">
    </div>
    <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm copyBtn" onclick="copyYellow()">Copy</button>
  </div>`;
  column.innerHTML = content;

  let yellowCode;
  if (size == 'lg') {
    yellowCode = document.getElementById('btn-yellow-code-lg');
  } else if (size == 'md') {
    yellowCode = document.getElementById('btn-yellow-code-md');
  } else if (size == 'sm') {
    yellowCode = document.getElementById('btn-yellow-code-sm');
  }

  yellowCode.innerText = `<a href="https://buymeboba.today/creator/${userPage}"><img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/yellowBtn.png" style="${style}"></a>`;
}

function btnBlack(size) {
  let style;
  if (size == 'lg') {
    style = 'width: 430px';
  } else if (size == 'md') {
    style = 'width: 350px';
  } else if (size == 'sm') {
    style = 'width: 270px';
  }
  let column = document.getElementById(`black-btn-${size}`);
  let content = ``;
  content = `
  <div>
    <button type="button" class="btn-close float-end" aria-label="Close" onclick="blackRecover('${size}')"></button>
  </div>
  <div class="row justify-content-center btn-img pt-5">
    <div class="rounded bg-dark text-white mb-5 ms-5" id="btn-black-code-${size}">
    </div>
    <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm copyBtn" onclick="copyBlack()">Copy</button>
  </div>`;
  column.innerHTML = content;

  let blackCode;
  if (size == 'lg') {
    blackCode = document.getElementById('btn-black-code-lg');
  } else if (size == 'md') {
    blackCode = document.getElementById('btn-black-code-md');
  } else if (size == 'sm') {
    blackCode = document.getElementById('btn-black-code-sm');
  }
  blackCode.innerText = `<a href="https://buymeboba.today/creator/${userPage}"><img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/blackBtn.png" style="${style}"></a>`;
}

function blackRecover(size) {
  if (size == 'lg') {
    style = 'width: 430px';
  } else if (size == 'md') {
    style = 'width: 350px';
  } else if (size == 'sm') {
    style = 'width: 270px';
  }
  let column = document.getElementById(`black-btn-${size}`);
  let content = ``;
  content = `
  <img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/blackBtn.png" style="${style}" class="btn-img p-5">
  <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm" onclick="btnBlack('${size}')">Generate now</button>`;
  column.innerHTML = content;
}

function yellowRecover(size) {
  if (size == 'lg') {
    style = 'width: 430px';
  } else if (size == 'md') {
    style = 'width: 350px';
  } else if (size == 'sm') {
    style = 'width: 270px';
  }
  let column = document.getElementById(`yellow-btn-${size}`);
  let content = ``;
  content = `
  <img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/yellowBtn.png" style="${style}" class="btn-img p-5">
  <button style="width:50%; height:30px" class="border border-muted mt-3 rounded-pill shadow-sm" onclick="btnYellow('${size}')">Generate now</button>`;
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
