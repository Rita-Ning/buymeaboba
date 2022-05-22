const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const View = require('../models/view');
const uuid = require('uuid4');

//if visitor give a visitor id
async function createVisitorid(req, res) {
  let visitorId = uuid();
  res.json({ visitor_id: visitorId });
}

// deal with withdraw info
async function saveViewPage(req, res) {
  try {
    let { user_id, page } = req.body;
    let d = new Date(Date.now());
    let date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();

    const result = await View.pageCheckDateExist(page, date);

    if (result == null) {
      return res.status(404).json({ error: 'wrong creator name' });
    }
    if (result.view_date.length == 0) {
      await View.pageAddViewDate(page, date, user_id);
    } else {
      let viewInfo = result;

      if (!viewInfo.view_date[0].view.includes(user_id)) {
        await View.pageAddView(page, date, user_id);
      }
    }
    res.send('view');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

async function saveViewarticle(req, res) {
  try {
    let { user_id, page } = req.body;
    let d = new Date(Date.now());
    let date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    if (!ObjectId.isValid(page)) {
      return res.status(404).json({ error: 'wrong article id' });
    }
    let articleId = mongoose.mongo.ObjectId(page);

    const result = await View.articleCheckDateExist(articleId, date);
    if (result.view_date.length == 0) {
      await View.articleAddViewDate(articleId, date, user_id);
    } else {
      let viewInfo = result;
      if (!viewInfo.view_date[0].view.includes(user_id)) {
        await View.articleAddView(articleId, date, user_id);
      }
    }
    res.send('view');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

module.exports = { saveViewPage, saveViewarticle, createVisitorid };
