const chat_rooom = require('../controllers/chat_controller');
const user = require('../controllers/user_controller');
const completeProfile = require('../controllers/complete_profile');
const blogPage = require('../controllers/blog-controller');
const path = require('path');

module.exports = (app) => {
  app.use('/api/1.0', chat_rooom);
  app.use('/api/1.0', user);
  app.use('/api/1.0', completeProfile);
  app.use('/api/1.0', blogPage);
  // app.use('/:name', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../../public/creator.html'));
  // });
};
