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

    //find top category by earning
    let categoryTop = await userProfile
      .find(
        {
          category: memberCount.category,
        },
        {
          _id: 1,
          supporter: 1,
          follower_count: 1,
          view: 1,
          post: 1,
          user_name: 1,
          user_page: 1,
          profile_pic: 1,
        }
      )
      .sort({ supporter: -1 })
      .limit(4);

    let pageWatch = [];
    for (let i = 0; i < categoryTop.length; i++) {
      let ttl_support = await support.aggregate([
        { $match: { creator_id: categoryTop[i]._id } },
        {
          $group: {
            _id: null,
            amount: { $sum: '$amount' }, // for your case use local.user_totaldocs
          },
        },
      ]);

      let ttl_post = await post.aggregate([
        { $match: { user_id: userId } },
        {
          $group: {
            _id: null,
            likes: { $sum: '$like_count' },
            views: { $sum: '$view' },
          },
        },
      ]);
      let ttl_comment = await post.aggregate([
        { $match: { user_id: userId } },
        {
          $group: {
            _id: null,
            comments: { $sum: { $size: '$comment' } },
          },
        },
      ]);

      let engagement = categoryTop[i].supporter.length + ttl_post[0].likes;
      let view =
        categoryTop[i].view + ttl_post[0].views + ttl_comment[0].comments;
      if (ttl_support[0] !== undefined) {
        earning = ttl_support[0].amount;
      } else {
        earning = 0;
      }
      let data = {
        user_id: categoryTop[i]._id,
        user_name: categoryTop[i].user_name,
        user_page: categoryTop[i].user_page,
        profile_pic: categoryTop[i].profile_pic,
        supporters: categoryTop[i].supporter.length,
        followers: categoryTop[i].follower_count,
        earning,
        engagement,
        view,
      };
      pageWatch.push(data);
    }

    //top earning post
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

    //recent post
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
    let tagTop = [];
    if (tagList.length !== 0) {
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
      if (tagSort.length > 4) {
        for (let i = 0; i < 4; i++) {
          tagTop.push(tagSort[i].name);
        }
      } else {
        for (let i = 0; i < tagSort.length; i++) {
          tagTop.push(tagSort[i].name);
        }
      }
    } else {
      tagTop = [];
    }

    data['overview'] = overview;
    data['earning_post'] = earningPost;
    data['recent_post'] = recentPost;
    data['summary_page'] = pageData;
    data['tags'] = tagTop;
    data['page_watch'] = pageWatch;
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
