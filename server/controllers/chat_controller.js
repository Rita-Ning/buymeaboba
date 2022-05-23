var mongoose = require('mongoose');
const { sendMsgEmail } = require('../../util/nodeemailer');
const Chatroom = require('../models/chat_model');

// send user chatted back
async function showChatroom(req, res) {
  let userId = req.body['user_id'];
  const rooms = await Chatroom.findChatroom(userId);
  let chatUsers = [];
  for (let i = 0; i < rooms.length; i++) {
    let chatShow = {};
    let member = rooms[i]['members'];
    for (let j = 0; j < member.length; j++) {
      if (member[j] === userId) {
        member.splice(j, 1);
      }
    }
    let memberId = mongoose.mongo.ObjectId(member[0]);
    let memberInfo = await Chatroom.findChatMember(memberId);
    chatShow['chatWith'] = memberInfo.user_name;
    chatShow['memberId'] = memberInfo._id;
    room_id = rooms[i]['_id'];
    let lastMsg = await Chatroom.sortChatList(room_id);
    lastMsg = lastMsg[0];
    chatShow['lastMsg'] = lastMsg['msg'];
    chatShow['time'] = lastMsg['date'];
    chatShow['roomId'] = lastMsg['room_id'];
    chatShow['memberImg'] = memberInfo.profile_pic;
    chatUsers.push(chatShow);
  }
  res.json(chatUsers);
}

// send history information back
async function getChatmsg(req, res) {
  const { roomid, member } = req.query;
  let memberId = mongoose.mongo.ObjectId(member);
  let memberInfo = await Chatroom.findChatMember(memberId);
  let roomId = mongoose.mongo.ObjectId(roomid);
  let doc = await Chatroom.getChatroomHistory(roomId);

  let data = {};
  data['chatHistory'] = doc;
  data['member'] = memberInfo;
  res.json(data);
}

// sending back data for sending to memberships
async function getChatmember(req, res) {
  let userId = req.body['user_id'];
  let id = mongoose.mongo.ObjectId(userId);
  const userInfo = await Chatroom.getMembership(id);

  // save follower
  let follower_count = userInfo.follower.length;
  let supporter_count = userInfo.supporter.length;

  let data = {
    follower_count,
    supporter_count,
  };

  res.json(data);
}

// get data and save to db
async function getChatMultiplemsg(req, res) {
  let { user_id, type, msg, send_email } = req.body;

  let id = mongoose.mongo.ObjectId(user_id);
  const userInfo = await Chatroom.getUserInfo(id);
  //supporter might duplicate
  let supporter_list = [];
  let mail = [];
  userInfo.supporter.forEach((supporter) => {
    mail.push(supporter.user_email);
    if (supporter.user_id) {
      if (!supporter_list.includes(supporter.user_id))
        supporter_list.push(supporter.user_id);
    }
  });

  // if choose to send email, send email
  if (send_email == 1) {
    sendMsgEmail(msg, userInfo.user_name, userInfo.profile_pic, mail);
  }

  //check membership type and save to db
  let roomId;
  let creator_name = userInfo.user_name;
  let creator_pic = userInfo.profile_pic;
  if (type == 'follow') {
    for (let i = 0; i < userInfo.follower.length; i++) {
      let follow = userInfo.follower[i];
      let checkRoom = await ifRoom(user_id, follow.follower_id);
      if (!checkRoom) {
        roomId = await createRoom(user_id, follow.follower_id);
        await createMsg(roomId, user_id, msg, creator_name, creator_pic);
      } else {
        roomId = await ifRoom(user_id, follow.follower_id);
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
        roomId = await ifRoom(user_id, support);
        await createMsg(roomId, user_id, msg, creator_name, creator_pic);
      }
    }
  }
  res.send('sucess');

  async function createRoom(user_id, member) {
    let newRoom = await Chatroom.createChatroom(user_id, member);
    return newRoom._id;
  }

  async function createMsg(roomId, sender, msg, creator_name, creator_pic) {
    let result = await Chatroom.createMsg(
      roomId,
      sender,
      msg,
      creator_name,
      creator_pic
    );
    return result;
  }

  async function ifRoom(user_id, member) {
    let checkroom = await Chatroom.checkRoomExist(user_id, member);
    if (checkroom) {
      return checkroom._id;
    } else {
      return false;
    }
  }
}

module.exports = {
  getChatMultiplemsg,
  getChatmember,
  getChatmsg,
  showChatroom,
};
