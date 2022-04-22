const chat_rooom = require('../controllers/chat_controller');

module.exports = (app) => {
  app.use('/', chat_rooom);
};
