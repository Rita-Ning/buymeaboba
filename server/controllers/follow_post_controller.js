var mongoose = require('mongoose');
let FollowPost = require('../models/follow_post_model');

async function getNewsfeed(req, res) {
  const { user_id } = req.body;
  let userId = mongoose.mongo.ObjectId(user_id);
  let following = await FollowPost.getFollowingList(userId);

  let all = following.following;
  let postList = [];
  for (let i = 0; i < all.length; i++) {
    let creator = all[i];
    let creatorId = await FollowPost.getFollowingInfo(creator);
    let creatorPost = await FollowPost.getFollowingPost(creatorId._id);

    postList = postList.concat(creatorPost);
  }

  let postSort = postList.sort((a, b) => b.create_time - a.create_time);
  let recentPost;
  if (postSort.length > 12) {
    recentPost = postSort.slice(0, 12);
  } else {
    recentPost = postSort;
  }
  let result = [];
  for (let j = 0; j < recentPost.length; j++) {
    let post = recentPost[j];
    let userId = mongoose.mongo.ObjectId(post.user_id);
    let userInfo = await FollowPost.getPostCreator(userId);
    let {
      _id,
      title,
      description,
      like_count,
      comment,
      create_time,
      user_id,
      content,
    } = post;

    if (!description) {
      description = content.split('.')[0] + '.';
    }
    let data = {
      _id,
      title,
      description,
      like_count,
      comment: comment.length,
      create_time,
      user_id,
    };
    data['user'] = userInfo;
    result.push(data);
  }
  res.json(result);
}

async function newsfeedSearch(req, res) {
  const { tag } = req.body;
  let posts = await FollowPost.searchByPostTag(tag);

  let popPost;
  if (posts.length > 12) {
    popPost = posts.slice(0, 12);
  } else {
    popPost = posts;
  }

  let result = [];
  for (let j = 0; j < popPost.length; j++) {
    let post = popPost[j];
    let userId = mongoose.mongo.ObjectId(post.user_id);
    let userInfo = await FollowPost.getPostCreator(userId);
    let {
      _id,
      title,
      description,
      like_count,
      comment,
      create_time,
      user_id,
      content,
    } = post;

    if (!description) {
      description = content.split('.')[0] + '.';
    }
    let data = {
      _id,
      title,
      description,
      like_count,
      comment: comment.length,
      create_time,
      user_id,
    };
    data['user'] = userInfo;
    result.push(data);
  }
  res.json(result);
}
module.exports = { getNewsfeed, newsfeedSearch };
