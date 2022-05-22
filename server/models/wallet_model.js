const { userProfile, support } = require('../../util/mongoose');

let checkBillingInfo = async (userId, method) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { billing_info: { $elemMatch: { method: method } } }
  );
  return result;
};

let saveWithdraw = async (
  userId,
  method,
  account_num,
  amount,
  recieve_time
) => {
  let result = await userProfile.updateOne(
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
  return result;
};

let saveBillingInfo = async (userId, method, account_num) => {
  await userProfile.updateOne(
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
};

let getWalletTotal = async (userId) => {
  let result = await support.aggregate([
    { $match: { creator_id: userId } },
    {
      $group: {
        _id: null,
        amount: { $sum: '$amount' },
      },
    },
  ]);
  return result;
};

let getWalletWithdraw = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    {
      withdraw: 1,
    }
  );
  return result;
};

module.exports = {
  checkBillingInfo,
  saveWithdraw,
  saveBillingInfo,
  getWalletTotal,
  getWalletWithdraw,
};
