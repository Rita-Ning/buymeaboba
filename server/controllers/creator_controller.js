const express = require('express');
var mongoose = require('mongoose');
const Creator = require('../models/creator');

const { userProfile, post } = require('../../util/mongoose');

async function addFollow(req, res) {
  try {
    // check header
    if (req.headers['content-type'] !== 'application/json') {
      return res
        .status(400)
        .json({ error: 'Content type need to be application/json' });
    }
    // check if user input is correct
    const { follower_id, following_name } = req.body;

    // update creator's follower
    let result = await Creator.addFollower(follower_id, following_name);
    // update creator's follower count
    await Creator.updateFollowerCount(following_name, 1);
    // update follower's following
    let id = mongoose.mongo.ObjectId(follower_id);
    await Creator.addFollowerList(id, following_name);

    res.send('success');
  } catch (error) {
    next(error);
  }
}

async function deleteFollow(req, res) {
  try {
    // check header
    if (req.headers['content-type'] !== 'application/json') {
      return res
        .status(400)
        .json({ error: 'Content type need to be application/json' });
    }
    // check if user input is correct
    const { unfollower_id, unfollowing_name } = req.body;

    // update creator's follower
    await Creator.deleteFollower(unfollower_id, unfollowing_name);
    // update creator's follower count
    await Creator.updateFollowerCount(unfollowing_name, -1);

    // update follower's following
    let id = mongoose.mongo.ObjectId(unfollower_id);
    await Creator.deleteFollowerList(id, unfollowing_name);

    res.send('success');
  } catch (error) {
    next(error);
  }
}

async function getCreatorPage(req, res) {
  try {
    const { name } = req.params;
    let user = await Creator.getCreatorInfo(name);
    if (user == null) {
      return res.status(404).json({ error: 'wrong creator name' });
    }
    let user_id = user['_id'];

    let postList = await post
      .find(
        { user_id: user_id },
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

    //popular post
    let postPopular = await Creator.getPopularPost(user_id);

    let {
      user_page,
      user_name,
      profile_pic,
      follower_count,
      follower,
      intro_post,
      about,
      _id,
    } = user;

    let data = {
      user_page,
      user_name,
      profile_pic,
      intro_post,
      about,
      follower_count,
      follower,
      _id,
    };
    data['post'] = postList;
    data['popular'] = postPopular;
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = { getCreatorPage, deleteFollow, addFollow };
