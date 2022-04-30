const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/creator/:name', async (req, res) => {
  const { name } = req.params;
  let user = await userProfile.findOne(
    { user_page: name },
    {
      user_page: 1,
      user_name: 1,
      profile_pic: 1,
      follower_count: 1,
      about: 1,
      intro_post: 1,
    }
  );
  let user_id = user['_id'];

  let postList = await post
    .find(
      { user_id: user_id },
      {
        title: 1,
        description: 1,
        content: 1,
        comment: 1,
        liked_by: 1,
        like_count: 1,
        create_time: 1,
      }
    )
    .sort({ create_time: -1 });

  let postPopular = await post
    .find(
      { user_id: user_id },
      {
        title: 1,
        liked_by: 1,
        like_count: 1,
        create_time: 1,
      }
    )
    .sort({ like_count: -1 })
    .limit(4);

  let {
    user_page,
    user_name,
    profile_pic,
    follower_count,
    intro_post,
    about,
    _id,
  } = user;

  let data = {
    user_page,
    user_name,
    profile_pic,
    intro_post,
    about,
    follower_count,
    _id,
  };
  data['post'] = postList;
  data['popular'] = postPopular;
  return res.status(200).json(data);
});

router.get('/creator', async (req, res) => {
  const { id } = req.query;
  let user_id = mongoose.mongo.ObjectId(id);

  try {
    let user = await userProfile.findOne(
      { _id: user_id },
      {
        user_page: 1,
        user_name: 1,
        profile_pic: 1,
        about: 1,
      }
    );
    return res.status(200).json(user);
  } catch (err) {
    res.send(err.message);
  }
});

router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  console.log(keyword);
  if (keyword) {
    let data = [];
    let resultName = await userProfile
      .find(
        { user_name: { $regex: keyword } },
        {
          user_page: 1,
          user_name: 1,
          about: 1,
          profile_pic: 1,
        }
      )
      .sort({ follower_count: -1 })
      .limit(4);

    let resultAbout = await userProfile
      .find(
        { about: { $regex: keyword } },
        {
          user_page: 1,
          user_name: 1,
          about: 1,
          profile_pic: 1,
        }
      )
      .sort({ follower_count: -1 })
      .limit(4);

    if (resultName.length == 0 && resultAbout.length == 0) {
      return res.status(400).json({ error: 'This keyword does not exist' });
    }

    for (let i = 0; i < 4; i++) {
      if (typeof resultName[i] !== 'undefined') {
        data.push(resultName[i]);
      }
      if (typeof resultAbout[i] !== 'undefined') {
        data.push(resultAbout[i]);
      }
    }
    return res.status(200).json(data);
  } else {
    let categories = [
      'Video Creator',
      'Artist',
      'Writer',
      'Musician',
      'Developers',
      'Podcaster',
    ];
    let data = [];
    for (let i = 0; i < categories.length; i++) {
      let oneCategory = categories[i];
      let user = await userProfile.find(
        { category: oneCategory },
        {
          user_page: 1,
          user_name: 1,
          about: 1,
          profile_pic: 1,
        }
      );
      // Shuffle array
      const shuffled = user.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, 4);

      if (oneCategory == 'Video Creator') {
        oneCategory = 'Video';
      }
      let categoryInfo = { category: oneCategory, creators: selected };

      data.push(categoryInfo);
    }

    return res.status(200).json(data);
  }
});

router.get('/search/frontpage', async (req, res) => {
  let data = [];
  let result = await userProfile
    .find(
      {},
      {
        user_page: 1,
        user_name: 1,
        about: 1,
        profile_pic: 1,
      }
    )
    .sort({ follower_count: -1 })
    .limit(8);

  return res.status(200).json(result);
});

module.exports = router;
