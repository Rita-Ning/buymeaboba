const { chatMsg } = require('../util/mongoose');
var mongoose = require('mongoose');

function campaign(server) {
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
      console.log(data);
      storeMsg(data);
      io.to(data.roomId).emit('chat-message', data);
    });
  });
}

function storeMsg(data) {
  var room_id = mongoose.mongo.ObjectId(data.roomId);
  const msg = new chatMsg({
    room_id: room_id,
    sender: data.sender,
    msg: data.message,
  });

  msg
    .save()
    .then(() => {
      console.log(msg);
    })
    .catch((error) => {
      console.log('error', error);
    });
}

// async function historyMsg(roomId) {
//   var room_id = mongoose.mongo.ObjectId(roomId);
//   let msgs = await chatMsg.find({ room_id: room_id }).sort({ date: -1 }); //有時間再設time
//   let msgList = [];
//   msgs.forEach((msg) => {
//     let chatMsg = {};
//     chatMsg['sender'] = msg['sender'];
//     chatMsg['msg'] = msg['msg'];
//   });
//   return msgList;
// }

module.exports = {
  campaign,
};
