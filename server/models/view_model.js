const { userProfile, post } = require('../../util/mongoose');

const pageCheckDateExist = async (page, date) => {
  let result = await userProfile.findOne(
    { user_page: page },
    { view_date: { $elemMatch: { date: date } } }
  );
  return result;
};

const pageAddViewDate = async (page, date, user_id) => {
  let result = await userProfile.updateOne(
    { user_page: page },
    {
      $push: { view_date: { date: date, view: [user_id] } },
      $inc: { view: 1 },
    }
  );
  return result;
};

const pageAddView = async (page, date, user_id) => {
  await userProfile.findOneAndUpdate(
    { user_page: page, view_date: { $elemMatch: { date: date } } },
    { $push: { 'view_date.$.view': user_id }, $inc: { view: 1 } }
  );
};

const articleCheckDateExist = async (articleId, date) => {
  let result = post.findOne(
    { _id: articleId },
    { view_date: { $elemMatch: { date: date } } }
  );
  return result;
};

const articleAddViewDate = async (articleId, date, user_id) => {
  let result = await post.updateOne(
    { _id: articleId },
    {
      $push: { view_date: { date: date, view: [user_id] } },
      $inc: { view: 1 },
    }
  );
  return result;
};

const articleAddView = async (articleId, date, user_id) => {
  let result = await post.findOneAndUpdate(
    { _id: articleId, view_date: { $elemMatch: { date: date } } },
    { $push: { 'view_date.$.view': user_id }, $inc: { view: 1 } }
  );
  return result;
};

module.exports = {
  pageCheckDateExist,
  pageAddViewDate,
  pageAddView,
  articleCheckDateExist,
  articleAddViewDate,
  articleAddView,
};
