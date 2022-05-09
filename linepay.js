const LinePay = require('line-pay-v3');
const axios = require('axios');
const crypto = require('crypto-js');
const uuid = require('uuid4');

let order = {
  amount: 4000,
  currency: 'TWD',
  orderId: 'Order2019101500005',
  packages: [
    {
      id: 'Item20191015001',
      amount: 4000,
      name: 'testPackageName',
      products: [
        {
          name: 'testProductName',
          quantity: 2,
          price: 2000,
        },
      ],
    },
  ],
  redirectUrls: {
    confirmUrl: 'https://example.com/confirmUrl',
    cancelUrl: 'https://example.com/cancelUrl',
  },
};

// linePay.request(order).then((res) => {
//   console.log(res);
// });

let key = 'd7a954f48e709d19ab52ec2528b68c73';
let nonce = uuid();
let requestUri = '/v3/payments/request';

let encrypt = crypto.HmacSHA256(
  key + requestUri + JSON.stringify(order) + nonce,
  key
);
let hmacBase64 = crypto.enc.Base64.stringify(encrypt);

let configs = {
  headers: {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': '1657058698',
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': hmacBase64,
  },
};
console.log(nonce);
console.log(hmacBase64);

axios
  .post('https://sandbox-api-pay.line.me/v3/payments/request', order, configs)
  .then((res) => {
    console.log(res.data);
  });

content = {
  amount: 4000,
  currency: 'TWD',
};

let transactionId = '2022041500710765610';
requestUri2 = `/v3/payments/${transactionId}/confirm`;

let encrypt2 = crypto.HmacSHA256(
  key + requestUri2 + JSON.stringify(content) + nonce,
  key
);
let hmacBase642 = crypto.enc.Base64.stringify(encrypt2);

let configs2 = {
  headers: {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': '1657058698',
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': hmacBase642,
  },
};

axios
  .post(
    `https://sandbox-api-pay.line.me/v3/payments/${transactionId}/confirm`,
    content,
    configs2
  )
  .then((res) => {
    console.log(res.data);
  });
