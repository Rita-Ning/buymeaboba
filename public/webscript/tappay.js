function logOut() {
  localStorage.clear();
}
// change view my page href
let myPage = localStorage.getItem('page_name');
document.getElementById('my-page').href = `/creator/${myPage}`;

//donate column setting
let setCount = document.getElementById('bobaAmount');
let oneBtn = document.getElementById('amountOne');
oneBtn.addEventListener('click', function () {
  setCount.innerHTML = `<input class="bg-white border-warning text-center mb-0 amount" style="width:35px"  oninput="bobaCount(event)" value=1 >`;
  document.getElementById('supportAmount').innerHTML = 80;
  oneBtn.innerHTML = `<button class="rounded-circle bg-warning border-warning text-white text-center mb-0" style="height:35px ;width:35px">1</button>`;
});

function bobaCount(e) {
  let count = e.target.value;
  let supportBtn = document.getElementById('supportBtn');
  if (!e.target.value || e.target.value == '0') {
    supportBtn.disabled = true;
  } else {
    supportBtn.disabled = false;
  }
  if (e.target.value !== '1') {
    document.getElementById(
      'amountOne'
    ).innerHTML = `<button class="rounded-circle bg-white border-warning text-center mb-0" style="height:35px ;width:35px">1</button>`;
  } else {
    document.getElementById(
      'amountOne'
    ).innerHTML = `<button class="rounded-circle bg-warning border-warning text-white text-center mb-0" style="height:35px ;width:35px">1</button>`;
  }
  document.getElementById('supportAmount').innerHTML = count * 80;
}

supportBtn.addEventListener('click', function () {
  let supportMoney = parseInt(
    document.getElementById('supportAmount').innerHTML
  );
  localStorage.setItem('support_amount', supportMoney);
});

let payBtn = document.getElementById('payBtn');
payBtn.addEventListener('click', function () {
  if (!localStorage.getItem('user_info')) {
    let user_name = document.getElementById('username').value;
    let user_email = document.getElementById('email').value;
    let supporterInfo = { user_name, user_email };
    localStorage.setItem('supporter_info', JSON.stringify(supporterInfo));
  }
});

function formChange() {
  document.getElementById('card-form').style.display = 'block';
  document.getElementById('card-choose').style.display = 'none';
}

function recoverForm() {
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('line-form').style.display = 'none';
  document.getElementById('card-choose').style.display = 'block';
}

let userId = localStorage.getItem('user_info');
let inputColumn = document.getElementsByClassName('notMember');
document.getElementById('lineemail').removeAttribute('required');
if (userId) {
  document.getElementById('email').removeAttribute('required');
  Array.from(document.getElementsByClassName('notMember')).forEach(function (
    element
  ) {
    element.style.display = 'none';
  });
}

//Tap pay
TPDirect.setupSDK(
  12348,
  'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
  'sandbox'
);
TPDirect.card.setup({
  fields: {
    number: {
      element: '.form-control.card-number',
      placeholder: 'card number: **** **** **** ****',
    },
    expirationDate: {
      element: document.getElementById('tappay-expiration-date'),
      placeholder: 'expiration day: MM / YY',
    },
    ccv: {
      element: $('.form-control.cvc')[0],
      placeholder: 'cvc / 3 digit',
    },
  },
  styles: {
    input: {
      color: 'gray',
    },
    ':focus': {
      color: 'black',
    },
    '.valid': {
      color: 'green',
    },
    '.invalid': {
      color: 'red',
    },
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
});

// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
  /* Disable / enable submit button depend on update.canGetPrime  */
  /* ============================================================ */

  // update.canGetPrime === true
  //     --> you can call TPDirect.card.getPrime()
  // const submitButton = document.querySelector('button[type="submit"]')
  if (update.canGetPrime) {
    // submitButton.removeAttribute('disabled')
    $('button[type="submit"]').removeAttr('disabled');
  } else {
    // submitButton.setAttribute('disabled', true)
    $('button[type="submit"]').attr('disabled', true);
  }

  /* Change card type display when card type change */
  /* ============================================== */

  // cardTypes = ['visa', 'mastercard', ...]
  var newType = update.cardType === 'unknown' ? '' : update.cardType;
  $('#cardtype').text(newType);

  /* Change form-group style when tappay field status change */
  /* ======================================================= */

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError('.card-number-group');
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess('.card-number-group');
  } else {
    setNumberFormGroupToNormal('.card-number-group');
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError('.expiration-date-group');
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess('.expiration-date-group');
  } else {
    setNumberFormGroupToNormal('.expiration-date-group');
  }

  if (update.status.cvc === 2) {
    setNumberFormGroupToError('.cvc-group');
  } else if (update.status.cvc === 0) {
    setNumberFormGroupToSuccess('.cvc-group');
  } else {
    setNumberFormGroupToNormal('.cvc-group');
  }
});

$('#support-form').on('submit', function (event) {
  event.preventDefault();

  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  // console.log(tappayStatus);

  // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('can not get prime');
    return;
  }

  let supporterInfo;
  let supportAmount = JSON.parse(localStorage.getItem('support_amount'));
  let supporter = JSON.parse(localStorage.getItem('supporter_info'));
  let creator = localStorage.getItem('creator_page');
  if (supporter) {
    supporterInfo = supporter;
  } else {
    supporterInfo = localStorage.getItem('user_info');
  }
  let path = window.location.pathname;
  let page = path.split('/')[1];
  let type;
  if (page == 'article') {
    type = path.split('/')[2];
  } else {
    type = 'homepage';
  }
  let supportMsg = document.querySelector('.support-msg').value;
  // console.log(supportMsg);
  if (!supportMsg) {
    supportMsg = '(ง •̀_•́)ง‼';
  }
  // Get prime
  TPDirect.card.getPrime(function (result) {
    if (result.status !== 0) {
      alert('get prime error ' + result.msg);
      return;
    }
    let prime = result.card.prime;

    let supportInfo = {
      prime: prime,
      amount: supportAmount,
      user: supporterInfo,
      creator,
      event: type,
      msg: supportMsg,
    };

    localStorage.removeItem('supporter_info');
    localStorage.removeItem('support_amount');

    // console.log(supportInfo);

    axios({
      method: 'post',
      url: '/api/1.0/support/checkout',
      data: JSON.stringify(supportInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        // console.log(res);
        thankMsg();
        document.getElementById('support-msg').value = '';
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});

function thankMsg() {
  let thanks = document.getElementById('support-line');
  let thankMsg = `
  <h>
  <h4 class="modal-title">Thank you for your support ! &nbsp&nbsp<span class="emoji">🎉</span></h4>	
  <button type="button" class="close mr-1 mb-4 pr-1" data-dismiss="modal" aria-hidden="true">&times;</button>
  `;
  thanks.innerHTML = thankMsg;
  document.getElementById('support-form').innerHTML = ``;
}

function setNumberFormGroupToError(selector) {
  $(selector).addClass('has-error');
  $(selector).removeClass('has-success');
}

function setNumberFormGroupToSuccess(selector) {
  $(selector).removeClass('has-error');
  $(selector).addClass('has-success');
}

function setNumberFormGroupToNormal(selector) {
  $(selector).removeClass('has-error');
  $(selector).removeClass('has-success');
}
