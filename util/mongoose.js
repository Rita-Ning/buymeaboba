const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(
  'mongodb+srv://BobaTang:UBWhEFSfvpzdpHIw@buymeboba.x2ecu.mongodb.net/buymeboba?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// MyModel.find({}, function (err, docs) {
//   console.log(docs);
// });
// // 使用mongoose提供的方法去獲得該資料庫這個table的資料\

// set chat room
const chatRoom = mongoose.model('chatRoom', {
  members: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const room = new chatRoom({
  members: ['d', 'c'],
});

// room
//   .save()
//   .then(() => {
//     console.log(room);
//   })
//   .catch((error) => {
//     console.log('error', error);
//   });

// store chat message
const chatMsg = mongoose.model('chatMsg', {
  room_id: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  sender: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// const msg = new chatMsg({
//   room_id: '62611bece2d367d844fd6f7a',
//   sender: 'a',
//   msg: 'yoyoyo',
// });

// msg
//   .save()
//   .then(() => {
//     console.log(msg);
//   })
//   .catch(() => {
//     console.log('error', error);
//   });

// chatRoom.find({ members: 'a' }, function (err, docs) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('First function call:', docs[0]['_id']);
//     console.log(typeof docs[0]['_id']);
//   }
// });

module.exports = {
  chatMsg,
  chatRoom,
};
