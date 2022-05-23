const mongoose = require('mongoose');
const Wallet = require('../models/wallet_model');

// deal with withdraw info
async function withdraw(req, res) {
  let { user_id, amount, method } = req.body;
  let userId = mongoose.mongo.ObjectId(user_id);
  let checkInfo = await Wallet.checkBillingInfo(userId, method);

  if (!checkInfo.billing_info[0]) {
    return res.json({ data: 'not-create' });
  } else {
    var d = new Date();
    let recieve_time = d.setDate(d.getDate() + 3);
    let account_num = checkInfo.billing_info[0].account_num;
    // save withdarw data
    await Wallet.saveWithdraw(
      userId,
      method,
      account_num,
      amount,
      recieve_time
    );
    res.json({ data: 'success' });
  }
}

// save billing info
async function billingMethod(req, res) {
  try {
    let { user_id, method, account_num } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);
    await Wallet.saveBillingInfo(userId, method, account_num); // save billing info to DB
    res.json({ data: 'sucess' });
  } catch (err) {
    res.send(err.message);
    next(err);
  }
}

// wallet page info
async function getBalance(req, res) {
  try {
    let { user_id } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);

    let ttl = await Wallet.getWalletTotal(userId);
    let ttlAmount;
    if (ttl[0] !== undefined) {
      ttlAmount = ttl[0].amount;
    } else {
      ttlAmount = 0;
    }

    let withdraw = await Wallet.getWalletWithdraw(userId);
    let ttlWithdraw = 0;
    withdraw.withdraw.forEach((ele) => {
      ttlWithdraw += ele.amount;
      ele['account_num'] = ele.account_num.substr(ele.account_num.length - 4);
    });
    let data = {};
    data['total'] = ttlAmount;
    data['withdraw'] = ttlWithdraw;
    data['transaction'] = withdraw.withdraw;
    res.json(data);
  } catch (err) {
    res.send(err.message);
    next(err);
  }
}

module.exports = { getBalance, billingMethod, withdraw };
