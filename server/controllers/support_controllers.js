var mongoose = require('mongoose');
const axios = require('axios');
const Support = require('../models/support_model');
const { sendSupportEmail } = require('../../util/nodeemailer');

async function tappay(req, res) {
  // check header
  if (req.headers['content-type'] !== 'application/json') {
    return res
      .status(400)
      .json({ error: 'Content type need to be application/json' });
  }

  let { prime, amount, user, creator, event, msg } = req.body;

  let userName;
  let userEmail;
  let userId;

  if (user.user_name) {
    userName = user.user_name;
    userEmail = user.user_email;
  } else {
    userId = mongoose.mongo.ObjectId(user);
    let userFind = await Support.getUser(userId);
    userName = userFind.user_name;
    userEmail = userFind.email;
    userId = userFind._id;
  }

  // Send data to TapPay
  const tapInfo = {
    prime,
    partner_key:
      'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG',
    merchant_id: 'AppWorksSchool_CTBC',
    details: 'AppWorksSchool_CTBC',
    amount,
    cardholder: {
      phone_number: '+886923456789',
      name: userName,
      email: userEmail,
    },
  };
  const tapResponse = await axios.post(
    'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
    tapInfo,
    {
      headers: {
        'x-api-key':
          'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG',
      },
    }
  );

  if (tapResponse.data.status !== 0) {
    return res.status(400).json({ error: 'get wrong prime' });
  }

  // support info
  try {
    let creator_id = await Support.getCreator(creator);

    let supportInfo;
    if (userId) {
      supportInfo = {
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        creator_id: creator_id._id,
        amount,
        event,
        method: 'bank',
        msg,
      };
    } else {
      supportInfo = {
        user_name: userName,
        user_email: userEmail,
        creator_id: creator_id._id,
        amount,
        event,
        method: 'bank',
        msg,
      };
    }

    // add into support db
    let addSupport = await Support.createSupport(supportInfo);

    //send email to supporter
    sendSupportEmail(msg, userName, amount, creator_id.email);

    // if post support add into post doc
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

      //update post earning data
      await Support.updatePostEarningInfo(postID, postSupport);
      await Support.updatePostEarningAmount(postID, postSupport);
    }

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

    //update user support info
    await Support.updateUserSupport(creatorId, supporterInfo);

    let data = { data: addSupport._id };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
}

module.exports = { tappay };
