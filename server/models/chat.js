const { chatMsg, chatRoom, userProfile } = require('../../util/mongoose');

const findChatroom = async (userId) => {
  let result = await chatRoom.find({ members: userId });
  return result;
};

const findChatMember = async (memberId) => {
  let result = await userProfile.findOne(
    { _id: memberId },
    { user_name: 1, profile_pic: 1 }
  );
  return result;
};
const getChatroomHistory = async (roomId) => {
  let result = await chatMsg
    .find(
      { room_id: roomId },
      { sender: 1, msg: 1, date: 1, sender_pic: 1, sender_name: 1 }
    )
    .sort({ date: 1 });
  return result;
};

const sortChatList = async (room_id) => {
  let result = await chatMsg.find({ room_id: room_id }).sort({ date: -1 });
  return result;
};

const getMembership = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { follower: 1, supporter: 1 }
  );
  return result;
};

const getUserInfo = async (userId) => {
  let result = await userProfile.findOne(
    { _id: userId },
    { follower: 1, supporter: 1, user_name: 1, profile_pic: 1 }
  );
  return result;
};

const createMsg = async (roomId, sender, msg, creator_name, creator_pic) => {
  let result = await chatMsg.create({
    room_id: roomId,
    sender: sender,
    sender_name: creator_name,
    sender_pic: creator_pic,
    msg: msg,
  });
  return result;
};

const createChatroom = async (user_id, member) => {
  let result = await chatRoom.create({ members: [user_id, member] });
  return result;
};

const checkRoomExist = async (user_id, member) => {
  let result = await chatRoom.findOne({ members: { $all: [user_id, member] } });
  return result;
};

module.exports = {
  findChatroom,
  findChatMember,
  getChatroomHistory,
  getMembership,
  getUserInfo,
  createMsg,
  createChatroom,
  checkRoomExist,
  sortChatList,
};
