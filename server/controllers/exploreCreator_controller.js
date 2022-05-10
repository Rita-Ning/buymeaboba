const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  // console.log(keyword);
  if (keyword) {
    let data = [];
    let resultName = await userProfile
      .find(
        { user_name: { $regex: keyword, $options: 'i' } },
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
