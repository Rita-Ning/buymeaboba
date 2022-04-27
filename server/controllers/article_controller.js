const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/article/:postid', async (req, res) => {
  const { postid } = req.params;
  let id = mongoose.mongo.ObjectId(postid);

  let postInfo = await post.findOne(
    { _id: id },
    {
      user_id: 1,
      title: 1,
      description: 1,
      content: 1,
      comment: 1,
      liked_by: 1,
      like_count: 1,
      create_time: 1,
    }
  );

  let userId = postInfo.user_id;
  let user = await userProfile.findOne(
    { _id: userId },
    {
      user_page: 1,
      user_name: 1,
      profile_pic: 1,
      follower_count: 1,
      about: 1,
    }
  );

  let postPopular = await post
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

  let {
    user_id,
    title,
    description,
    content,
    comment,
    liked_by,
    like_count,
    create_time,
  } = postInfo;

  data = {
    user_id,
    title,
    description,
    content,
    comment,
    liked_by,
    like_count,
    create_time,
  };

  data['user'] = user;
  data['popular'] = postPopular;

  return res.status(200).json(data);
});

module.exports = router;
