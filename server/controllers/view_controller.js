const express = require('express');
const { MongoUnexpectedServerResponseError } = require('mongodb');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');
const uuid = require('uuid4');

//if visitor give a visitor id
router.post('/visitorid', async (req, res, next) => {
  let visitorId = uuid();
  res.json({ visitor_id: visitorId });
});

// deal with withdraw info
router.post('/view/page', async (req, res, next) => {
  try {
    let { user_id, page } = req.body;
    let d = new Date(Date.now());
    let date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();

    const result = await userProfile.findOne(
      { user_page: page },
      { view_date: { $elemMatch: { date: date } } }
    );

    if (result == null) {
      return res.status(404).json({ error: 'wrong creator name' });
    }
    if (result.view_date.length == 0) {
      await userProfile.updateOne(
        { user_page: page },
        {
          $push: { view_date: { date: date, view: [user_id] } },
          $inc: { view: 1 },
        }
      );
    } else {
      let viewInfo = await userProfile.findOne(
        { user_page: page },
        { view_date: { $elemMatch: { date: date } } }
      );
      if (!viewInfo.view_date[0].view.includes(user_id)) {
        await userProfile.findOneAndUpdate(
          { user_page: page, view_date: { $elemMatch: { date: date } } },
          { $push: { 'view_date.$.view': user_id }, $inc: { view: 1 } }
        );
      }
    }
    res.send('view');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.post('/view/article', async (req, res, next) => {
  try {
    let { user_id, page } = req.body;
    let d = new Date(Date.now());
    let date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    if (!ObjectId.isValid(page)) {
      return res.status(404).json({ error: 'wrong article id' });
    }
    let articleId = mongoose.mongo.ObjectId(page);

    const result = await post.findOne(
      { _id: articleId },
      { view_date: { $elemMatch: { date: date } } }
    );
    if (result.view_date.length == 0) {
      await post.updateOne(
        { _id: articleId },
        {
          $push: { view_date: { date: date, view: [user_id] } },
          $inc: { view: 1 },
        }
      );
    } else {
      let viewInfo = await post.findOne(
        { _id: articleId },
        { view_date: { $elemMatch: { date: date } } }
      );
      if (!viewInfo.view_date[0].view.includes(user_id)) {
        await post.findOneAndUpdate(
          { _id: articleId, view_date: { $elemMatch: { date: date } } },
          { $push: { 'view_date.$.view': user_id }, $inc: { view: 1 } }
        );
      }
    }
    res.send('view');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
