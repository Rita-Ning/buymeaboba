require('dotenv').config();
const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const validator = require('validator');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// const room = new chatRoom({
//   members: ['d', 'c'],
// });

// room
//   .save()
//   .then(() => {
//     console.log(room);
//   })
//   .catch((error) => {
//     console.log('error', error);
//   });

// chat message
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

//find功能
// chatRoom.find({ members: 'a' }, function (err, docs) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('First function call:', docs[0]['_id']);
//     console.log(typeof docs[0]['_id']);
//   }
// });

// user profile
const userProfile = mongoose.model('user', {
  user_name: {
    type: String,
    trim: true,
  },
  user_page: {
    type: String,
    trim: true,
    lowercase: true,
  },
  provider: {
    type: String,
    default: 'native',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email');
      }
    },
  },
  password: {
    type: String,
    trim: true,
  },
  profile_pic: {
    type: String,
    trim: true,
  },
  page_create: {
    type: String,
    dafault: '0',
  },
  about: {
    type: String,
  },
  category: {
    type: String,
  },
  is_creator: {
    type: String,
    default: '0',
  },
  is_admin: {
    type: String,
    default: '0',
  },
  follower_count: {
    type: Number,
  },
  follower: {
    type: Array,
  },
  following: {
    type: [String],
  },
  supporter: {
    type: Array,
  },
  my_member: {
    type: Array,
  },
  post: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  intro_post: {
    type: String,
  },
  event: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  event_attend: {
    type: Array,
  },
  billing_info: {
    type: Array,
  },
  withdraw: {
    type: Array,
  },
  wallet: {
    type: Number,
  },
  total: {
    type: Number,
  },
});

// post info
const post = mongoose.model('post', {
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  post_tag: {
    type: Array,
  },
  comment: {
    type: Array,
  },
  like_count: {
    type: Number,
  },
  liked_by: {
    type: Array,
  },
  views: {
    type: Number,
  },
  read_rate: {
    type: [String],
  },
  content_length: {
    type: Number,
  },
  earning_amount: {
    type: Number,
  },
  earning_from: {
    type: Array,
  },
});

async function main() {
  let result = await userProfile
    .findOne({ email: 'test100@test.com' })
    .select('_id user_name is_admin is_creator profile_pic email');
  if (!result) {
    console.log('no result');
  }
  console.log(result);
}

// await userProfile.create();

// await userProfile.findOne({_id: 1}, {
//   _id:1 ,
//   name: 1,
//   email:1
// })

// main();

module.exports = {
  chatMsg,
  chatRoom,
  userProfile,
  post,
};