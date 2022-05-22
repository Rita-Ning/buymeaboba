const { userProfile, post, support } = require('../../util/mongoose');

const getCreatorOverview = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { follower_count: 1, supporter: 1, category: 1 }
  );
  return result;
};

const getCreatorSupportAmount = async (userId) => {
  let result = await support.find({ creator_id: userId }, { amount: 1 });
  return result;
};

const getCategoryTop = async (creatorCategory) => {
  let result = await userProfile
    .find(
      {
        category: creatorCategory,
      },
      {
        _id: 1,
        supporter: 1,
        follower_count: 1,
        view: 1,
        post: 1,
        user_name: 1,
        user_page: 1,
        profile_pic: 1,
      }
    )
    .sort({ supporter: -1 })
    .limit(4);
  return result;
};

const supportSum = async (creatorId) => {
  let result = await support.aggregate([
    { $match: { creator_id: creatorId } },
    {
      $group: {
        _id: null,
        amount: { $sum: '$amount' },
      },
    },
  ]);
  return result;
};

const postInfoSum = async (userId) => {
  let result = await post.aggregate([
    { $match: { user_id: userId } },
    {
      $group: {
        _id: null,
        likes: { $sum: '$like_count' },
        views: { $sum: '$view' },
      },
    },
  ]);
  return result;
};

const commentSum = async (userId) => {
  let result = await post.aggregate([
    { $match: { user_id: userId } },
    {
      $group: {
        _id: null,
        comments: { $sum: { $size: '$comment' } },
      },
    },
  ]);
  return result;
};

const getEarningPost = async (userId) => {
  let result = await post
    .find(
      { user_id: userId },
      {
        _id: 1,
        title: 1,
        create_time: 1,
        earning_amount: 1,
        earning_from: 1,
        like_count: 1,
        comment: 1,
        view: 1,
      }
    )
    .sort({ earning_amount: -1 })
    .limit(3);
  return result;
};

const getRecentPost = async (userId) => {
  let result = await post
    .find(
      { user_id: userId },
      {
        _id: 1,
        title: 1,
        create_time: 1,
        earning_amount: 1,
        earning_from: 1,
        like_count: 1,
        comment: 1,
        view: 1,
      }
    )
    .sort({ create_time: -1 })
    .limit(3);
  return result;
};

const getPageInfo = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    {
      follower_count: 1,
      supporter: 1,
      view: 1,
    }
  );
  return result;
};

const getAllPost = async (userId) => {
  let result = await post.find(
    { user_id: userId },
    {
      earning_from: 1,
      like_count: 1,
      comment: 1,
    }
  );
  return result;
};

const getPostTags = async (userId) => {
  let result = await post.find(
    { user_id: userId },
    {
      post_tag: 1,
      like_count: 1,
    }
  );
  return result;
};

module.exports = {
  getCreatorOverview,
  getCreatorSupportAmount,
  getCategoryTop,
  supportSum,
  postInfoSum,
  commentSum,
  getEarningPost,
  getRecentPost,
  getPageInfo,
  getAllPost,
  getPostTags,
};
