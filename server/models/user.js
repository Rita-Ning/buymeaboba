const { userProfile } = require('../../util/mongoose');

const checkEmail = async (email) => {
  let result = await userProfile.find({ email: email });
  return result;
};

const createUserinfo = async (userInfo) => {
  await userProfile.create(userInfo);
};

const getUserIdentity = async (email) => {
  let result = await userProfile.findOne(
    { email: email },
    { _id: 1, is_admin: 1 }
  );
  return result;
};

const getUserPassword = async (email) => {
  let result = await userProfile.findOne({ email: email }, { password: 1 });
  return result;
};

const getUserInfo = async (email) => {
  let result = await userProfile.findOne(
    { email: email },
    { _id: 1, is_admin: 1, page_create: 1, user_page: 1 }
  );
  return result;
};

module.exports = {
  checkEmail,
  createUserinfo,
  getUserIdentity,
  getUserPassword,
  getUserInfo,
};
