require('dotenv').config();
var mongoose = require('mongoose');
const crypto = require('crypto-js');
const uuid = require('uuid4');
const axios = require('axios');
const { sendSupportEmail } = require('../../util/nodeemailer');
const Linepay = require('../models/linepay_model');

const key = process.env.LINEPAY_KEY;
const ChannelId = process.env.LINEPAY_ChannelId;

async function linepay(req, res) {
  try {
    let order = req.body;
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
        'X-LINE-ChannelId': ChannelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': hmacBase64,
      },
    };
    const result = await axios.post(
      'https://sandbox-api-pay.line.me/v3/payments/request',
      order,
      configs
    );
    let url = result.data.info.paymentUrl.web;
    res.json({ data: url });
  } catch (error) {
    console.log(error);
  }
}

async function linepayCheck(req, res) {
  try {
    let { content, transactionId, supportInfo } = req.body;
    let nonce = uuid();
    requestUri2 = `/v3/payments/${transactionId}/confirm`;

    let encrypt2 = crypto.HmacSHA256(
      key + requestUri2 + JSON.stringify(content) + nonce,
      key
    );
    let hmacBase642 = crypto.enc.Base64.stringify(encrypt2);

    let configs2 = {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': ChannelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': hmacBase642,
      },
    };

    const result = await axios.post(
      `https://sandbox-api-pay.line.me/v3/payments/${transactionId}/confirm`,
      content,
      configs2
    );

    if (result.data.returnCode == '0000') {
      // support info
      try {
        let { amount, user, creator, event, msg } = supportInfo;
        let creator_id = await Linepay.getCreator(creator);

        let userName;
        let userEmail;
        let userId;

        if (user.user_name) {
          userName = user.user_name;
          userEmail = user.user_email;
        } else {
          userId = mongoose.mongo.ObjectId(user);
          let userFind = await Linepay.getUser(userId);

          userName = userFind.user_name;
          userEmail = userFind.email;
          userId = userFind._id;
        }

        let supportSave;
        if (userId) {
          supportSave = {
            user_id: userId,
            user_name: userName,
            user_email: userEmail,
            creator_id: creator_id._id,
            amount,
            event,
            method: 'linepay',
          };
        } else {
          supportSave = {
            user_name: userName,
            user_email: userEmail,
            creator_id: creator_id._id,
            amount,
            event,
            method: 'linepay',
          };
        }

        // add support info into support db
        await Linepay.createSupportInfo(supportSave);

        //send email
        sendSupportEmail(msg, userName, amount, creator_id.email);

        // if event is post, support info add into db post doc
        if (event !== 'homepage') {
          let postSupport;
          if (userId) {
            postSupport = {
              user_id: userId,
              amount,
              time: Date.now(),
            };
          } else {
            postSupport = {
              user_id: userEmail,
              amount,
              time: Date.now(),
            };
          }
          let postID = mongoose.mongo.ObjectId(event);
          await Linepay.updatePostEarningInfo(postID, postSupport);
          await Linepay.updatePostEarningAmount(postID, amount);

          let creatorId = creator_id._id;

          let supporterInfo;
          //update creator support list
          if (userId) {
            supporterInfo = {
              event,
              user_id: userId,
              user_name: userName,
              user_email: userEmail,
              time: Date.now(),
            };
          } else {
            supporterInfo = {
              event,
              user_name: userName,
              user_email: userEmail,
              time: Date.now(),
            };
          }
          await Linepay.updateCreatorEarning(creatorId, supporterInfo);
        }
      } catch (error) {
        console.log(error);
        res.send(error.message);
      }
    }
    res.send('pay success!');
  } catch (error) {
    console.log(error);
  }
}
module.exports = { linepay, linepayCheck };
