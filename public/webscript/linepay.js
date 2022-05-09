let page = localStorage.getItem('page_name');
var currentLocation = window.location.href;

function linePay() {
  let supportAmount = JSON.parse(localStorage.getItem('support_amount'));
  let order = {
    amount: supportAmount,
    currency: 'TWD',
    orderId: 'buymeboba',
    packages: [
      {
        id: `${page}`,
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
      cancelUrl: 'https://example.com/cancelUrl',
    },
  };
  axios({
    method: 'post',
    url: `/api/1.0/linepay`,
    data: order,
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      let url = res.data.data;
      location.href = url;
    })
    .catch(function (err) {
      console.log(err);
    });
}

// content = {
//   amount: 4000,
//   currency: 'TWD',
// };

// let transactionId = '2022050900712544910';
// requestUri2 = `/v3/payments/${transactionId}/confirm`;

// let encrypt2 = crypto.HmacSHA256(
//   key + requestUri2 + JSON.stringify(content) + nonce,
//   key
// );
// let hmacBase642 = crypto.enc.Base64.stringify(encrypt2);

// let configs2 = {
//   headers: {
//     'Content-Type': 'application/json',
//     'X-LINE-ChannelId': '1657058698',
//     'X-LINE-Authorization-Nonce': nonce,
//     'X-LINE-Authorization': hmacBase642,
//   },
// };

// axios
//   .post(
//     `https://sandbox-api-pay.line.me/v3/payments/${transactionId}/confirm`,
//     content,
//     configs2
//   )
//   .then((res) => {
//     console.log(res.data);
//   });
