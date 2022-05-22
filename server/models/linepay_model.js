const { userProfile, support, post } = require('../../util/mongoose');

const getCreator = async (creatorPage) => {
  let result = await userProfile.findOne(
    { user_page: creatorPage },
    { _id: 1, email: 1 }
  );
  return result;
};

const getUser = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { user_name: 1, email: 1 }
  );
  return result;
};

const createSupportInfo = async (supportInfo) => {
  let result = support.create(supportInfo);
  return result;
};

const updatePostEarningInfo = async (postID, postSupport) => {
  let result = await post.updateOne(
    { _id: postID },
    { $push: { earning_from: postSupport } },
    { new: true, upsert: true }
  );
  return result;
};

const updatePostEarningAmount = async (postID, amount) => {
  let result = await post.findOneAndUpdate(
    { _id: postID },
    { $inc: { earning_amount: amount } },
    { new: true }
  );
  return result;
};

const updateCreatorEarning = async (creatorId, supporterInfo) => {
  await userProfile.updateOne(
    { _id: creatorId },
    { $push: { supporter: supporterInfo } },
    { new: true, upsert: true }
  );
};

module.exports = {
  getCreator,
  getUser,
  createSupportInfo,
  updatePostEarningInfo,
  updatePostEarningAmount,
  updateCreatorEarning,
};
