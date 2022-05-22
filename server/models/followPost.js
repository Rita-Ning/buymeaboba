const { userProfile, post } = require('../../util/mongoose');

const getFollowingList = async (userId) => {
  let result = await userProfile.findOne({ _id: userId }, { following: 1 });
  return result;
};

const getFollowingInfo = async (creator) => {
  let result = await userProfile.findOne({ user_page: creator }, { _id: 1 });
  return result;
};

const getFollowingPost = async (creatorId) => {
  let result = post.find(
    { user_id: creatorId },
    {
      _id: 1,
      title: 1,
      description: 1,
      like_count: 1,
      comment: 1,
      create_time: 1,
      user_id: 1,
      content: 1,
    }
  );
  return result;
};

const getPostCreator = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    {
      user_name: 1,
      profile_pic: 1,
      user_page: 1,
    }
  );
  return result;
};

const searchByPostTag = async (tag) => {
  let result = await post
    .find({
      post_tag: {
        $elemMatch: {
          $regex: tag,
          $options: 'i',
        },
      },
    })
    .sort({ like_count: -1 });
  return result;
};

module.exports = {
  getFollowingList,
  getFollowingInfo,
  getFollowingPost,
  getPostCreator,
  searchByPostTag,
};
