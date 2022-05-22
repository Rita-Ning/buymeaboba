const { userProfile } = require('../../util/mongoose');

const searchCreator = async (keyword) => {
  const result = await userProfile
    .find(
      { user_name: { $regex: keyword, $options: 'i' } },
      {
        user_page: 1,
        user_name: 1,
        about: 1,
        profile_pic: 1,
      }
    )
    .sort({ follower_count: -1 })
    .limit(4);
  return result;
};

const searchCreatorAbout = async (keyword) => {
  const result = await userProfile
    .find(
      { about: { $regex: keyword } },
      {
        user_page: 1,
        user_name: 1,
        about: 1,
        profile_pic: 1,
      }
    )
    .sort({ follower_count: -1 })
    .limit(4);
  return result;
};

const getCategoryCreator = async (oneCategory) => {
  let result = await userProfile.find(
    { category: oneCategory },
    {
      user_page: 1,
      user_name: 1,
      about: 1,
      profile_pic: 1,
    }
  );
  return result;
};

const getPopularCreator = async () => {
  let result = await userProfile
    .find(
      {},
      {
        user_page: 1,
        user_name: 1,
        about: 1,
        profile_pic: 1,
      }
    )
    .sort({ follower_count: -1 })
    .limit(8);
  return result;
};

module.exports = {
  searchCreator,
  searchCreatorAbout,
  getCategoryCreator,
  getPopularCreator,
};
