const { client } = require('../../util/redis');
var CronJob = require('cron').CronJob;
const ExploreCreator = require('../models/explore_creator_model');

async function search(req, res) {
  const { keyword } = req.query;
  if (keyword) {
    let data = [];
    let resultName = await ExploreCreator.searchCreator(keyword);
    let resultAbout = await ExploreCreator.searchCreatorAbout(keyword);

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
      let user = await ExploreCreator.getCategoryCreator(oneCategory);

      // Shuffle array
      const shuffled = user.sort(() => 0.5 - Math.random());
      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, 4);

      if (oneCategory == 'Video Creator') {
        //let category be one wording
        oneCategory = 'Video';
      }
      let categoryInfo = { category: oneCategory, creators: selected };

      data.push(categoryInfo);
    }

    return res.status(200).json(data);
  }
}

async function recommendHome(req, res) {
  try {
    const camapaignCache = await client.get('campaign');
    if (camapaignCache == null) {
      let result = await ExploreCreator.getPopularCreator();
      await client.set('campaign', JSON.stringify(result));
      res.json(result);
    } else {
      res.json(JSON.parse(camapaignCache));
    }
  } catch (error) {
    next(error);
  }
}

// refresh redis
new CronJob(
  '0 */4 * * *',
  async function () {
    await client.del('campaign');
    console.log('redis refresh!');
  },
  null,
  true,
  'Asia/Taipei'
);

module.exports = { search, recommendHome };
