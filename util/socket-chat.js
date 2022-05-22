const { chatMsg, userProfile } = require('../util/mongoose');
var mongoose = require('mongoose');

async function campaign(server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('user-enter', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send-chat-message', (data) => {
      (async () => {
        let sendInfo = await storeMsg(data);
        io.to(data.roomId).emit('chat-message', sendInfo);
      })();
    });
  });
}

async function storeMsg(data) {
  var room_id = mongoose.mongo.ObjectId(data.roomId);
  var userId = mongoose.mongo.ObjectId(data.sender);
  var senderInfo = await userProfile.findOne(
    { _id: userId },
    { profile_pic: 1, user_name: 1 }
  );
  let sendInfo = {
    room_id: room_id,
    sender: data.sender,
    sender_name: senderInfo.user_name,
    sender_pic: senderInfo.profile_pic,
    msg: data.message,
    time: Date.now(),
  };

  const msg = await chatMsg.create(sendInfo).catch((error) => {
    console.log('error', error);
  });
  return sendInfo;
}

module.exports = {
  campaign,
};
