const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/creator/:name', async (req, res) => {
  const { name } = req.params;
  let user = await userProfile.findOne(
    { user_page: name },
    {
      user_page: 1,
      user_name: 1,
      profile_pic: 1,
      follower_count: 1,
      about: 1,
      intro_post: 1,
    }
  );
  let user_id = user['_id'];

  let postList = await post.find(
    { user_id: user_id },
    {
      title: 1,
      description: 1,
      content: 1,
      comment: 1,
      liked_by: 1,
      like_count: 1,
      create_time: 1,
    }
  );

  let {
    user_page,
    user_name,
    profile_pic,
    follower_count,
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
    _id,
  };
  data['post'] = postList;
  return res.status(200).json(data);
});

module.exports = router;
