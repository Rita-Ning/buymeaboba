const express = require('express');
var mongoose = require('mongoose');
const crypto = require('crypto-js');
const uuid = require('uuid4');
const axios = require('axios');

const router = express.Router();
const { userProfile, support } = require('../../util/mongoose');

router.post('/linepay', async (req, res, next) => {
  try {
    let order = req.body;
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
    const result = await axios.post(
      'https://sandbox-api-pay.line.me/v3/payments/request',
      order,
      configs
    );
    console.log(result);
    let url = result.data.info.paymentUrl.web;

    res.json({ data: url });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
