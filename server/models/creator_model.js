const { userProfile, post } = require('../../util/mongoose');

const addFollower = async (follower_id, following_name) => {
  let result = await userProfile.updateOne(
    { user_page: following_name },
    { $push: { follower: { follower_id: follower_id, time: Date.now() } } },
    { new: true, upsert: true }
  );
  return result;
};

const updateFollowerCount = async (name, count) => {
  let result = await userProfile.findOneAndUpdate(
    { user_page: name },
    { $inc: { follower_count: count } },
    { new: true }
  );
  return result;
};

const addFollowerList = async (id, following_name) => {
  await userProfile.updateOne(
    { _id: id },
    { $push: { following: following_name } },
    { new: true, upsert: true }
  );
};

const deleteFollower = async (unfollower_id, unfollowing_name) => {
  await userProfile.updateOne(
    { user_page: unfollowing_name },
    { $pull: { follower: { follower_id: unfollower_id } } },
    { new: true, upsert: true }
  );
};

const deleteFollowerList = async (id, unfollowing_name) => {
  await userProfile.updateOne(
    { _id: id },
    { $pull: { following: unfollowing_name } },
    { new: true, upsert: true }
  );
};

const getCreatorInfo = async (name) => {
  let result = await userProfile.findOne(
    { user_page: name },
    {
      user_page: 1,
      user_name: 1,
      profile_pic: 1,
      follower_count: 1,
      follower: 1,
      about: 1,
      intro_post: 1,
    }
  );
  return result;
};

const getPopularPost = async (user_id) => {
  let result = await post
    .find(
      { user_id: user_id },
      {
        title: 1,
        liked_by: 1,
        like_count: 1,
        create_time: 1,
        support_only: 1,
      }
    )
    .sort({ like_count: -1 })
    .limit(4);
  return result;
};

const getPostInfo = async (userId) => {
  let result = await post
    .find(
      { user_id: userId },
      {
        title: 1,
        description: 1,
        content: 1,
        comment: 1,
        liked_by: 1,
        like_count: 1,
        create_time: 1,
        support_only: 1,
      }
    )
    .sort({ create_time: -1 });
  return result;
};

module.exports = {
  addFollower,
  updateFollowerCount,
  addFollowerList,
  deleteFollower,
  deleteFollowerList,
  getCreatorInfo,
  getPopularPost,
  getPostInfo,
};
