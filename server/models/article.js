const { userProfile, post } = require('../../util/mongoose');
var mongoose = require('mongoose');

const getPostInfo = async (postId) => {
  let result = await post.findOne(
    { _id: postId },
    {
      user_id: 1,
      title: 1,
      description: 1,
      content: 1,
      comment: 1,
      liked_by: 1,
      like_count: 1,
      create_time: 1,
      earning_from: 1,
      support_only: 1,
    }
  );
  return result;
};

const getCreatorInfo = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    {
      user_page: 1,
      user_name: 1,
      profile_pic: 1,
      follower_count: 1,
      follower: 1,
      about: 1,
    }
  );
  return result;
};

const getPopularPost = async (userId) => {
  let result = await post
    .find(
      { user_id: userId },
      {
        title: 1,
        liked_by: 1,
        like_count: 1,
        create_time: 1,
      }
    )
    .sort({ like_count: -1 })
    .limit(4);
  return result;
};

const addComment = async (
  article_id,
  user_id,
  user_name,
  comment_time,
  comment
) => {
  let result = await post.findOneAndUpdate(
    { _id: mongoose.mongo.ObjectId(article_id) },
    {
      $push: {
        comment: {
          user_id,
          user_name,
          comment_time,
          comment,
        },
      },
    },
    { upsert: true, new: true }
  );
  return result;
};

const addLike = async (article_id, user_id, time) => {
  let result = await post.findOneAndUpdate(
    { _id: mongoose.mongo.ObjectId(article_id) },
    {
      $push: {
        liked_by: {
          user_id,
          time,
        },
      },
      $inc: { like_count: 1 },
    },
    { upsert: true, new: true }
  );
  return result;
};

const deleteLike = async (article_id, user_id) => {
  let result = await post.findOneAndUpdate(
    { _id: mongoose.mongo.ObjectId(article_id) },
    {
      $pull: {
        liked_by: {
          user_id,
        },
      },
      $inc: { like_count: -1 },
    },
    { upsert: true, new: true }
  );
  return result;
};

module.exports = {
  getPostInfo,
  getCreatorInfo,
  getPopularPost,
  addComment,
  addLike,
  deleteLike,
};
