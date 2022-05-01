const express = require('express');
var mongoose = require('mongoose');
const axios = require('axios');

const router = express.Router();
const { userProfile, support } = require('../../util/mongoose');

router.post('/support/checkout', async (req, res, next) => {
  // check header
  if (req.headers['content-type'] !== 'application/json') {
    return res
      .status(400)
      .json({ error: 'Content type need to be application/json' });
  }
  let { prime, amount, user, creator } = req.body;

  let userName;
  let userEmail;

  if (user.user_name) {
    userName = user.user_name;
    userEmail = user.user_email;
  } else {
    userId = mongoose.mongo.ObjectId(user.user_id);
    let userFind = await userProfile.findOne(
      { _id: userId },
      { user_name: 1, user_email: 1 }
    );
    userName = userFind.user_name;
    userEmail = userFind.user_id;
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

    let supportInfo = {
      user_name: userName,
      user_email: userEmail,
      creator_id,
      amount,
    };

    // add into support db
    let addSupport = await support.create(supportInfo);

    let userInfo = {
      user_name: userName,
      email: userEmail,
    };

    //add into user db
    let addUser = await userProfile.create(userInfo);
    // console.log(addUser)

    let creatorId = mongoose.mongo.ObjectId(creator_id);

    //update creator support list
    let supporterInfo = {
      event: homepage,
      user_name: userName,
      user_email: userEmail,
      time: Date.now(),
    };
    userProfile.update(
      { _id: creatorId },
      { $push: { supporter: supporterInfo } },
      done
    );

    let data = { data: addSupport._id };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

module.exports = router;
