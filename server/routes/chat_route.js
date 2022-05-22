const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const ChatController = require('../controllers/chat_controller');

router.post('/chat/multiple-msg', wrapAsync(ChatController.getChatMultiplemsg));
router.post('/chat/member', wrapAsync(ChatController.getChatmember));
router.get(`/chat/msg`, wrapAsync(ChatController.getChatmsg));
router.post('/chat/chatroom', wrapAsync(ChatController.showChatroom));

module.exports = router;
