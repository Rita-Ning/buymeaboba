const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { chatMsg, chatRoom } = require('../../util/mongoose');

router.post('/chatroom/users', async (req, res, next) => {
  try {
    let user = req.body['name'];
    const rooms = await chatRoom.find({ members: user });
    console.log(rooms);
    let chatUsers = [];
    for (let i = 0; i < rooms.length; i++) {
      // console.log(rooms);
      let chatShow = {};
      let member = rooms[i]['members'];
      for (let j = 0; j < member.length; j++) {
        if (member[j] === user) {
          member.splice(j, 1);
        }
      }
      chatShow['chatWith'] = member;
      console.log(chatShow['chatWith']);
      room_id = rooms[i]['_id'];
      let lastMsg = await chatMsg.find({ room_id: room_id }).sort({ date: -1 });
      lastMsg = lastMsg[0];
      chatShow['lastMsg'] = lastMsg['msg'];
      chatShow['time'] = lastMsg['date']; //time格式待處理
      chatShow['roomId'] = lastMsg['room_id'];
      chatUsers.push(chatShow);
      console.log(chatUsers);
    }
    res.json(chatUsers);
  } catch (error) {
    next(error);
  }
});

router.get(`/msg`, async (req, res, next) => {
  try {
    const { roomid } = req.query;
    console.log(roomid);
    console.log(typeof roomid);
    roomId = mongoose.mongo.ObjectId(roomid);
    console.log(roomId);
    let doc = await chatMsg
      .find({ room_id: roomId })
      .sort({ date: 1 })
      .select('sender msg date');
    res.send(doc);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
