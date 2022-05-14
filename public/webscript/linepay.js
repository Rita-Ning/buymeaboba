let creator = localStorage.getItem('creator_page');
var currentLocation = window.location.href;

function formLine() {
  document.getElementById('line-form').style.display = 'block';
  document.getElementById('card-choose').style.display = 'none';
}

let lineBtn = document.getElementById('lineBtn');
lineBtn.addEventListener('click', function () {
  if (!localStorage.getItem('user_info')) {
    let user_name = document.getElementById('linename').value;
    let user_email = document.getElementById('lineemail').value;
    let supporterInfo = { user_name, user_email };
    localStorage.setItem('supporter_info', JSON.stringify(supporterInfo));
  }
});

async function linePay() {
  let supportAmount = JSON.parse(localStorage.getItem('support_amount'));
  let time = Date.now();
  let order = {
    amount: supportAmount,
    currency: 'TWD',
    orderId: userId + `${time}`,
    packages: [
      {
        id: `${creator}`,
        amount: supportAmount,
        name: 'buymeboba',
        products: [
          {
            name: 'buymeboba',
            quantity: 1,
            price: supportAmount,
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: currentLocation,
      cancelUrl: currentLocation,
    },
  };

  try {
    let result = await axios({
      method: 'post',
      url: `/api/1.0/linepay`,
      data: order,
      headers: { 'Content-Type': 'application/json' },
    });
    let url = result.data.data;
    // supportMsg = document.getElementById('support-msg').value;
    supportMsg = document.querySelector('.support-msg').value;
    if (supportMsg == '') {
      supportMsg = '(ง •̀_•́)ง‼';
    }
    localStorage.setItem('support_msg', supportMsg);
    location.href = url;
  } catch (err) {
    console.log(err);
  }
}

let url = new URL(window.location.href);
let transactionId = url.searchParams.get('transactionId');
let supportAmount = JSON.parse(localStorage.getItem('support_amount'));
if (transactionId) {
  let content = {
    amount: supportAmount,
    currency: 'TWD',
  };

  let supporterInfo;
  let supporter = JSON.parse(localStorage.getItem('supporter_info'));
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

  let supportInfo = {
    amount: supportAmount,
    user: supporterInfo,
    creator,
    event: type,
    msg: localStorage.getItem('support_msg'),
  };

  let checkInfo = {
    content,
    transactionId,
    supportInfo,
  };

  axios({
    method: 'post',
    url: `/api/1.0/linepay/check`,
    data: checkInfo,
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      localStorage.removeItem('support_amount');
      localStorage.removeItem('supporter_info');
      window.location = window.location.pathname;
      localStorage.removeItem('support_msg');
    })
    .catch(function (err) {
      console.log(err);
      console.log(err.response);
    });
}
