const { userProfile } = require('../../util/mongoose');

const updateUserProfile = async (userId, profileInfo) => {
  let result = await userProfile.findOneAndUpdate(
    { _id: userId },
    profileInfo,
    { new: true }
  );
  return result;
};

const checkPageExist = async (pageName) => {
  let result = await userProfile.findOne({
    user_page: pageName,
  });
  return result;
};

module.exports = { updateUserProfile, checkPageExist };
