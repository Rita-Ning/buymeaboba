const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post, support } = require('../../util/mongoose');

router.post('/dashboard/normal', async (req, res) => {
  try {
    let data = {};
    const { user_id } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);
    let memberCount = await userProfile.findOne(
      { _id: userId },
      { follower_count: 1, supporter: 1, category: 1 }
    );

    let supportAmount = await support.find(
      { creator_id: userId },
      { amount: 1 }
    );
    let ttlAmount = 0;
    supportAmount.forEach((pay) => {
      ttlAmount += pay.amount;
    });

    let overview = {
      followers: memberCount.follower_count,
      supporters: memberCount.supporter.length,
      earnings: ttlAmount,
    };

    // find top category
    // let categoryTop = await userProfile.find({
    //   category: memberCount.category
    // },{
    //   user_page: 1,
    //   follower_count:1,
    // })

    let earningPost = await post
      .find(
        { user_id: userId },
        {
          _id: 1,
          title: 1,
          create_time: 1,
          earning_amount: 1,
          earning_from: 1,
          like_count: 1,
          comment: 1,
        }
      )
      .sort({ earning_amount: -1 })
      .limit(3);
    // console.log(earningPost);
    earningPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
    });

    let recentPost = await post
      .find(
        { user_id: userId },
        {
          _id: 1,
          title: 1,
          create_time: 1,
          earning_amount: 1,
          earning_from: 1,
          like_count: 1,
          comment: 1,
        }
      )
      .sort({ create_time: -1 })
      .limit(3);

    recentPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
    });
    // console.log(recentPost);

    data['overview'] = overview;
    data['earning_post'] = earningPost;
    data['recent_post'] = recentPost;
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
