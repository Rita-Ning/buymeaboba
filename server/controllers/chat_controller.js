const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { chatMsg, chatRoom, userProfile } = require('../../util/mongoose');

router.post('/chatroom', async (req, res, next) => {
  try {
    let userId = req.body['user_id'];
    const rooms = await chatRoom.find({ members: userId });
    let chatUsers = [];
    for (let i = 0; i < rooms.length; i++) {
      let chatShow = {};
      let member = rooms[i]['members'];
      for (let j = 0; j < member.length; j++) {
        if (member[j] === userId) {
          member.splice(j, 1);
        }
      }
      memberId = mongoose.mongo.ObjectId(member[0]);
      let memberInfo = await userProfile.findOne(
        { _id: memberId },
        { user_name: 1, profile_pic: 1 }
      );
      chatShow['chatWith'] = memberInfo.user_name;
      chatShow['memberId'] = memberInfo._id;
      // console.log(chatShow['chatWith']);
      room_id = rooms[i]['_id'];
      let lastMsg = await chatMsg.find({ room_id: room_id }).sort({ date: -1 });
      lastMsg = lastMsg[0];
      chatShow['lastMsg'] = lastMsg['msg'];
      chatShow['time'] = lastMsg['date'];
      chatShow['roomId'] = lastMsg['room_id'];
      chatShow['memberImg'] = memberInfo.profile_pic;
      chatUsers.push(chatShow);
    }
    res.json(chatUsers);
  } catch (error) {
    next(error);
  }
});

router.get(`/msg`, async (req, res, next) => {
  try {
    const { roomid, member } = req.query;
    memberId = mongoose.mongo.ObjectId(member);
    let memberInfo = await userProfile.findOne(
      { _id: memberId },
      { profile_pic: 1, user_name: 1 }
    );
    roomId = mongoose.mongo.ObjectId(roomid);
    // console.log(roomId);
    let doc = await chatMsg
      .find(
        { room_id: roomId },
        { sender: 1, msg: 1, date: 1, sender_pic: 1, sender_name: 1 }
      )
      .sort({ date: 1 });

    let data = {};
    data['chatHistory'] = doc;
    data['member'] = memberInfo;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
