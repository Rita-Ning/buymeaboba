const { userProfile, support, post } = require('../../util/mongoose');

let getUser = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { user_name: 1, email: 1 }
  );
  return result;
};

let getCreator = async (creatorPage) => {
  let result = await userProfile.findOne(
    { user_page: creatorPage },
    { _id: 1, email: 1 }
  );
  return result;
};

let createSupport = async (supportInfo) => {
  let result = await support.create(supportInfo);
  return result;
};

let updatePostEarningInfo = async (postID, postSupportInfo) => {
  await post.updateOne(
    { _id: postID },
    { $push: { earning_from: postSupportInfo } },
    { new: true, upsert: true }
  );
};

let updatePostEarningAmount = async (postID, amount) => {
  await post.findOneAndUpdate(
    { _id: postID },
    { $inc: { earning_amount: amount } },
    { new: true }
  );
};

let updateUserSupport = async (creatorId, supporterInfo) => {
  await userProfile.updateOne(
    { _id: creatorId },
    { $push: { supporter: supporterInfo } },
    { new: true, upsert: true }
  );
};

module.exports = {
  getUser,
  getCreator,
  createSupport,
  updatePostEarningInfo,
  updatePostEarningAmount,
  updateUserSupport,
};
