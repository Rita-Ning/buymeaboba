const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const path = require('path');
const { userProfile, post } = require('../../util/mongoose');

router.post('/post/create', async (req, res) => {
  // check header
  // if (req.headers['content-type'] !== 'application/json') {
  //   return res
  //     .status(400)
  //     .json({ error: 'Content type need to be application/json' });
  // }
  let { title, user_id, description, content, pin, tags, support_only } =
    req.body;
  // console.log(req.body);
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required' });
  }
  let post_tag = tags.split(',');
  post_tag = post_tag.map((s) => s.trim().toLowerCase());
  const postInfo = {
    user_id: mongoose.mongo.ObjectId(user_id),
    title,
    description,
    content,
    post_tag,
    support_only,
    create_time: Date.now(),
  };

  // console.log(postInfo)

  try {
    let userId = mongoose.mongo.ObjectId(user_id);
    const addPost = await post.create(postInfo);
    let postId = addPost._id;
    const result = await userProfile.findOneAndUpdate(
      { _id: userId },
      { $push: { post: postId } }
    );
    let user_page = result.user_page;

    if (pin == true) {
      await userProfile.updateOne(
        { _id: mongoose.mongo.ObjectId(user_id) },
        { intro_post: postId }
      );
    }

    return res.status(200).json({ user_page: user_page });
  } catch (error) {
    res.send(error.message);
    next(error);
  }
});

module.exports = router;
