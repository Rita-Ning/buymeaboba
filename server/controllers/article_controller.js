const readingTime = require('reading-time');
var mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
let Article = require('../models/article');

async function getArticle(req, res) {
  const { postid } = req.params;
  //check if postid valid
  if (!ObjectId.isValid(postid)) {
    return res.status(404).json({ error: 'wrong article id' });
  }
  let id = mongoose.mongo.ObjectId(postid);
  let postInfo = await Article.getPostInfo(id);

  //check if postid correct
  if (postInfo.length == 0) {
    res.status(404);
  }

  let userId = postInfo.user_id;
  let user = await Article.getCreatorInfo(userId);

  let postPopular = await Article.getPopularPost(userId);

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

  // calculate reading time
  let stats = readingTime(content);
  let read_time = stats.text;

  // let comment sent sort by comment created time
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
}

//recieve comment and save
async function addComment(req, res) {
  let { article_id, user_id, user_name, comment_time, comment } = req.body;
  let addComment = await Article.addComment(
    article_id,
    user_id,
    user_name,
    comment_time,
    comment
  );
  res.json({ comment: addComment.comment.length });
}

//recieve like and save
async function addLike(req, res) {
  let { article_id, user_id, time } = req.body;
  let result = await Article.addLike(article_id, user_id, time);
  res.json({ like_count: result.like_count });
}

//delete like
async function deleteLike(req, res) {
  let { article_id, user_id } = req.body;
  let result = await Article.deleteLike(article_id, user_id);
  res.json({ like_count: result.like_count });
}

module.exports = { getArticle, addComment, addLike, deleteLike };
