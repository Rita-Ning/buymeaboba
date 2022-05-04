const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { chatMsg, chatRoom, userProfile } = require('../../util/mongoose');

// send user chatted back
router.post('/chat/chatroom', async (req, res, next) => {
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

// send history information back
router.get(`/chat/msg`, async (req, res, next) => {
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

// sending back data for sending to memberships
router.post('/chat/member', async (req, res, next) => {
  try {
    let userId = req.body['user_id'];
    let id = mongoose.mongo.ObjectId(userId);
    const userInfo = await userProfile.findOne(
      { _id: id },
      { follower: 1, supporter: 1 }
    );
    // console.log(userInfo);

    // save follower
    let follower_count = userInfo.follower.length;
    let supporter_count = userInfo.supporter.length;

    let data = {
      follower_count,
      supporter_count,
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// get data and save to db
router.post('/chat/multiple-msg', async (req, res, next) => {
  try {
    let { user_id, type, msg } = req.body;

    let id = mongoose.mongo.ObjectId(user_id);
    const userInfo = await userProfile.findOne(
      { _id: id },
      { follower: 1, supporter: 1, user_name: 1, sender_pic: 1 }
    );

    // save supporter and check if user is a member if not then not send/ send by email
    //supporter might duplicate
    let supporter_list = [];
    userInfo.supporter.forEach((supporter) => {
      if (supporter.user_id) {
        if (!supporter_list.includes(supporter.user_id))
          supporter_list.push(supporter.user_id);
      }
    });

    //check type and save to db
    let roomId;
    let creator_name = userInfo.user_name;
    let creator_pic = userInfo.sender_pic;
    if (type == 'follow') {
      for (let i = 0; i < userInfo.follower.length; i++) {
        let follow = userInfo.follower[i];
        let checkRoom = await ifRoom(user_id, follow.follower_id);
        if (!checkRoom) {
          roomId = await createRoom(user_id, follow.follower_id);
          await createMsg(roomId, user_id, msg, creator_name, creator_pic);
        } else {
          rooomId = await ifRoom(user_id, follow.follower_id);
          await createMsg(roomId, user_id, msg, creator_name, creator_pic);
        }
      }
    } else {
      for (let j = 0; j < supporter_list.length; j++) {
        let support = supporter_list[j];
        let checkRoom = await ifRoom(user_id, support);
        if (!checkRoom) {
          roomId = await createRoom(user_id, support);
          await createMsg(roomId, user_id, msg, creator_name, creator_pic);
        } else {
          rooomId = await ifRoom(user_id, support);
          await createMsg(roomId, user_id, msg, creator_name, creator_pic);
        }
      }
    }
    res.send('sucess');
  } catch (err) {
    next(err);
  }

  async function createRoom(user_id, member) {
    let newRoom = await chatRoom.create({ members: [user_id, member] });
    // console.log(newRoom);
    return newRoom._id;
  }

  async function createMsg(roomId, sender, msg, creator_name, creator_pic) {
    // console.log(roomId);
    await chatMsg.create({
      room_id: roomId,
      sender: sender,
      sender_name: creator_name,
      sender_pic: creator_pic,
      msg: msg,
    });
  }

  async function ifRoom(user_id, member) {
    let checkroom = await chatRoom.findOne({
      members: { $all: [user_id, member] },
    });
    if (checkroom) {
      return checkroom._id;
    } else {
      return false;
    }
  }
});

module.exports = router;
