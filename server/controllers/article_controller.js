const express = require('express');
const readingTime = require('reading-time');
var mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/article/:postid', async (req, res) => {
  const { postid } = req.params;
  if (!ObjectId.isValid(postid)) {
    return res.status(404).json({ error: 'wrong article id' });
  }
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
      earning_from: 1,
      support_only: 1,
    }
  );
  if (postInfo.length == 0) {
    res.status(404);
  }

  let userId = postInfo.user_id;
  let user = await userProfile.findOne(
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
    earning_from,
    support_only,
  } = postInfo;

  // reading time
  let stats = readingTime(content);
  let read_time = stats.text;

  // let comment sent sort by comment time
  let commentSort = comment.sort((a, b) => b.comment_time - a.comment_time);

  data = {
    user_id,
    title,
    description,
    content,
    comment: commentSort,
    liked_by,
    like_count,
    create_time,
    read_time,
    earning_from,
    support_only,
  };

  data['user'] = user;
  data['popular'] = postPopular;

  return res.status(200).json(data);
});

//recieve comment and save
router.post('/comment/add', async (req, res) => {
  let { article_id, user_id, user_name, comment_time, comment } = req.body;
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
  res.json({ comment: result.comment.length });
});

//recieve like and save
router.post('/like/add', async (req, res) => {
  let { article_id, user_id, time } = req.body;
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
  res.json({ like_count: result.like_count });
});

//delete like
router.post('/like/delete', async (req, res) => {
  let { article_id, user_id } = req.body;
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
  res.json({ like_count: result.like_count });
});

module.exports = router;
