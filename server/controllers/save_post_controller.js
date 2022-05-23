const mongoose = require('mongoose');
const SavePost = require('../models/save_post_model');

async function createPost(req, res) {
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

  try {
    let userId = mongoose.mongo.ObjectId(user_id);
    const addPost = await SavePost.createPost(postInfo);

    let postId = addPost._id;
    const result = await SavePost.updateCreatorPostList(userId, postId);

    let user_page = result.user_page;

    if (pin == true) {
      await SavePost.updatePinnedPost(userId);
    }

    return res.status(200).json({ user_page: user_page });
  } catch (error) {
    res.send(error.message);
    next(error);
  }
}

module.exports = { createPost };
