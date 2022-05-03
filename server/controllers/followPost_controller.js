const express = require('express');
var mongoose = require('mongoose');
const { nextTick } = require('process');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.post('/newsfeed', async (req, res) => {
  try {
    const { user_id } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);
    let following = await userProfile.findOne(
      { _id: userId },
      { following: 1 }
    );
    let all = following.following;
    let postList = [];
    for (let i = 0; i < all.length; i++) {
      let creator = all[i];
      let creatorId = await userProfile.findOne(
        { user_page: creator },
        { _id: 1 }
      );
      let creatorPost = await post.find(
        { user_id: creatorId._id },
        {
          title: 1,
          description: 1,
          like_count: 1,
          comment: 1,
          create_time: 1,
          user_id: 1,
          content: 1,
        }
      );
      // console.log(creatorPost);
      postList = postList.concat(creatorPost);
    }

    let postSort = postList.sort((a, b) => b.create_time - a.create_time);
    let recentPost = postSort.slice(11);
    let result = [];
    for (let j = 0; j < recentPost.length; j++) {
      let post = recentPost[j];
      let userId = mongoose.mongo.ObjectId(post.user_id);
      let userInfo = await userProfile.findOne(
        { _id: userId },
        {
          user_name: 1,
          profile_pic: 1,
          user_page: 1,
        }
      );
      let {
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
