const { userProfile, post } = require('../../util/mongoose');

let createPost = async (postInfo) => {
  let result = await post.create(postInfo);
  return result;
};

let updateCreatorPostList = async (userId, postId) => {
  let result = userProfile.findOneAndUpdate(
    { _id: userId },
    { $push: { post: postId } }
  );
  return result;
};

let updatePinnedPost = async (userId) => {
  userProfile.updateOne({ _id: userId }, { intro_post: postId });
};

module.exports = { createPost, updateCreatorPostList, updatePinnedPost };
