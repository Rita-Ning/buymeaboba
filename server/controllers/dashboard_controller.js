var mongoose = require('mongoose');
const Dashboard = require('../models/dashboard_model');

async function createDashboard(req, res) {
  try {
    let data = {};
    const { user_id } = req.body;
    let userId = mongoose.mongo.ObjectId(user_id);
    let memberCount = await Dashboard.getCreatorOverview(userId);
    let supportAmount = await Dashboard.getCreatorSupportAmount(userId);

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
    let categoryTop = await Dashboard.getCategoryTop(memberCount.category);

    let pageWatch = [];
    for (let i = 0; i < categoryTop.length; i++) {
      let ttl_support = await Dashboard.supportSum(categoryTop[i]._id);
      let ttl_post = await Dashboard.postInfoSum(userId);
      let ttl_comment = await Dashboard.commentSum(userId);

      //deal with if count = 0
      let likeCount;
      let viewCount;
      if (ttl_post[0] !== undefined) {
        likeCount = ttl_post[0].likes;
        viewCount = ttl_post[0].views;
      } else {
        likeCount = 0;
        viewCount = 0;
      }

      let commentCount;
      if (ttl_comment[0] !== undefined) {
        commentCount = ttl_comment[0].comments;
      } else {
        commentCount = 0;
      }

      let engagement =
        categoryTop[i].supporter.length + likeCount + commentCount;
      let view = categoryTop[i].view + viewCount;
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
    let earningPost = await Dashboard.getEarningPost(userId);

    earningPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
    });

    //recent post
    let recentPost = await Dashboard.getRecentPost(userId);

    recentPost.forEach((data) => {
      data.comment = data.comment.length;
      data.earning_from = data.earning_from.length;
    });
    let pageInfo = await Dashboard.getPageInfo(userId);

    let allPost = await Dashboard.getAllPost(userId);
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

    //get top tags
    let postTags = await Dashboard.getPostTags(userId);

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
}

module.exports = { createDashboard };
