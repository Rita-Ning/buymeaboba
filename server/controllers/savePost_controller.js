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
  let { title, user_id, description, content } = req.body;
  console.log(req.body);
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required' });
  }

  const postInfo = {
    user_id: mongoose.mongo.ObjectId(user_id),
    title,
    description,
    content,
    create_time: Date.now(),
  };

  console.log(postInfo);

  try {
    let userId = mongoose.mongo.ObjectId(user_id);
    const addPost = await post.create(postInfo);
    let postId = addPost._id;
    const result = await userProfile.findOneAndUpdate(
      { _id: userId },
      { $push: { post: postId } }
    );
    let user_page = result.user_page;

    console.log(result);
    return res.status(200).json({ user_page: user_page });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
