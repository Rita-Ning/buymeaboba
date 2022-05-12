const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, support } = require('../../util/mongoose');

// deal with withdraw info
router.post('/withdraw', async (req, res, next) => {
  let { user_id, amount, method } = req.body;
  let userId = mongoose.mongo.ObjectId(user_id);
  let checkInfo = await userProfile.findOne(
    { _id: userId },
    { billing_info: { $elemMatch: { method: method } } }
  );

  if (!checkInfo.billing_info[0]) {
    return res.json({ data: 'not-create' });
  } else {
    var d = new Date();
    let recieve_time = d.setDate(d.getDate() + 3);
    let account = await userProfile.findOne(
      { _id: userId },
      { billing_info: { $elemMatch: { method: method } } }
    );
    let account_num = account.billing_info[0].account_num;
    let saveInfo = await userProfile.updateOne(
      { _id: userId },
      {
        $push: {
          withdraw: {
            amount: amount,
            method: method,
            account_num: account_num,
            time: Date.now(),
            receive_time: recieve_time,
          },
        },
      }
    );
    res.json({ data: 'success' });
  }
});

// save billing info
router.post('/billing', async (req, res, next) => {
  try {
    let { user_id, method, account_num } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);
    let billingInfo = await userProfile.updateOne(
      { _id: userId },
      {
        $push: {
          billing_info: {
            account_num: account_num,
            method: method,
          },
        },
      }
    );
    res.json({ data: 'sucess' });
  } catch (error) {
    res.send(error.message);
  }
});

// wallet page info
router.post('/balance', async (req, res, next) => {
  try {
    let { user_id } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);

    let ttl = await support.aggregate([
      { $match: { creator_id: userId } },
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' }, // for your case use local.user_totaldocs
        },
      },
    ]);
    console.log(ttl);
    let ttl_amount = ttl[0].amount;
    let withdraw = await userProfile.findOne(
      { _id: userId },
      {
        withdraw: 1,
      }
    );
    let ttl_withdraw = 0;
    withdraw.withdraw.forEach((ele) => {
      ttl_withdraw += ele.amount;
      ele.account_num = ele.account_num.substr(ele.account_num.length - 4);
    });
    let data = {};
    data['total'] = ttl_amount;
    data['withdraw'] = ttl_withdraw;
    data['transaction'] = withdraw.withdraw;
    res.json(data);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
