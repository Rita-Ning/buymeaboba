const chat_rooom = require('../controllers/chat_controller');
const user = require('../controllers/user_controller');
const completeProfile = require('../controllers/complete_profile');
const creatorPage = require('../controllers/creator_controller');
const articlePage = require('../controllers/article_controller');
const postSave = require('../controllers/savePost_controller');
const supportRecord = require('../controllers/support_controllers');

const path = require('path');

module.exports = (app) => {
  app.use('/api/1.0', chat_rooom);
  app.use('/api/1.0', user);
  app.use('/api/1.0', completeProfile);
  app.use('/api/1.0', creatorPage);
  app.use('/api/1.0', articlePage);
  app.use('/api/1.0', postSave);
  app.use('/api/1.0', supportRecord);
  app.use('/creator/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/creator.html'));
  });
  app.use('/article/:postid', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/article.html'));
  });
};
