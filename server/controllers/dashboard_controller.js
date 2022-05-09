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
          view: 1,
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
          view: 1,
        }
      )
      .sort({ create_time: -1 })
      .limit(3);

    recentPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
    });
    // console.log(recentPost);
    let pageInfo = await userProfile.findOne(
      { _id: userId },
      {
        follower_count: 1,
        supporter: 1,
        view: 1,
      }
    );
    let pageSupport = await support.find({ creator_id: userId }, { amount: 1 });

    let allPost = await post.find(
      { user_id: userId },
      {
        earning_from: 1,
        like_count: 1,
        comment: 1,
      }
    );
    // console.log(earningPost);
    let engagement = pageInfo.supporter.length;
    allPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
      engagement += data.like_count;
      engagement += data.earning_from[0];
      engagement += data.comment[0];
    });
    let alllLikes = 0;
    allPost.forEach((data) => {
      alllLikes += data.like_count;
    });

    let pageData = {
      follower_count: pageInfo.follower_count,
      supporter: pageInfo.supporter.length,
      view: pageInfo.view,
      earnings: ttlAmount,
      engagement,
      like: alllLikes,
    };
    // console.log(pageInfo);

    //tags
    let postTags = await post.find(
      { user_id: userId },
      {
        post_tag: 1,
        like_count: 1,
      }
    );
    let tagList = [];
    postTags.forEach((data) => {
      for (let i = 0; i < data.post_tag.length; i++) {
        let tagValue = {
          name: data.post_tag[i],
          value: data.like_count,
        };
        tagList.push(tagValue);
      }
    });
    let result = [];
    for (let i = 1; i < tagList.length; i++) {
      if (result.some((tag) => tag.name === tagList[i].name)) {
        const index = result.findIndex((tag) => tag.name === tagList[i].name);
        result[index].value += tagList[i].value;
      } else {
        result.push(tagList[i]);
      }
    }
    let tagSort = result.sort((a, b) => (b.value > a.value ? 1 : -1));
    let tagTop = [];
    for (let i = 0; i < 4; i++) {
      tagTop.push(tagSort[i].name);
    }
    console.log(tagTop);

    data['overview'] = overview;
    data['earning_post'] = earningPost;
    data['recent_post'] = recentPost;
    data['summary_page'] = pageData;
    data['tags'] = tagTop;
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
