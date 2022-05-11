const express = require('express');
var mongoose = require('mongoose');
const axios = require('axios');

const router = express.Router();
const { userProfile, support, post } = require('../../util/mongoose');

router.post('/support/checkout', async (req, res, next) => {
  // check header
  if (req.headers['content-type'] !== 'application/json') {
    return res
      .status(400)
      .json({ error: 'Content type need to be application/json' });
  }

  let { prime, amount, user, creator, event } = req.body;

  let userName;
  let userEmail;
  let userId;

  if (user.user_name) {
    userName = user.user_name;
    userEmail = user.user_email;
  } else {
    userId = mongoose.mongo.ObjectId(user);
    let userFind = await userProfile.findOne(
      { _id: userId },
      { user_name: 1, email: 1 }
    );
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
    let creator_id = await userProfile.findOne(
      { user_page: creator },
      { _id: 1 }
    );

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
      };
    } else {
      supportInfo = {
        user_name: userName,
        user_email: userEmail,
        creator_id: creator_id._id,
        amount,
        event,
        method: 'bank',
      };
    }
    // console.log(supportInfo);

    // add into support db
    let addSupport = await support.create(supportInfo);

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
      console.log(postSupport);
      await post.updateOne(
        { _id: postID },
        { $push: { earning_from: postSupport } },
        { new: true, upsert: true }
      );

      await post.findOneAndUpdate(
        { _id: postID },
        { $inc: { earning_amount: amount } },
        { new: true }
      );
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

    // console.log(supporterInfo);
    await userProfile.updateOne(
      { _id: creatorId },
      { $push: { supporter: supporterInfo } },
      { new: true, upsert: true }
    );

    let data = { data: addSupport._id };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

module.exports = router;
