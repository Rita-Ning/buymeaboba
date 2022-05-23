require('dotenv').config();
const mongoose = require('mongoose');
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

// chat message
const chatMsg = mongoose.model('chatMsg', {
  room_id: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  sender: {
    type: String,
    required: true,
  },
  sender_name: {
    type: String,
    required: true,
  },
  sender_pic: {
    type: String,
  },
  msg: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

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
    default: 0,
  },
  follower: {
    type: Array,
  },
  following: {
    type: Array,
  },
  supporter: {
    type: Array,
  },
  post: {
    type: [Array],
  },
  intro_post: {
    type: String,
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
  view: {
    type: Number,
    default: 0,
  },
  view_date: {
    type: Array,
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
  description: {
    type: String,
  },
  content: {
    type: String,
  },
  create_time: {
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
    default: 0,
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
  support_only: {
    type: Number,
    default: 0,
  },
  view: {
    type: Number,
    default: 0,
  },
  view_date: {
    type: Array,
  },
});

const support = mongoose.model('support', {
  event: {
    type: String,
    default: 'homepage',
  },
  user_id: {
    type: String,
  },
  user_name: {
    type: String,
  },
  user_email: {
    type: String,
  },
  creator_id: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  amount: {
    type: Number,
  },
  pay_time: {
    type: Date,
    default: Date.now,
  },
  recieve_time: {
    type: Date,
    //add 3 days
    default: () => new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
  },
  method: {
    type: String,
  },
  msg: {
    type: String,
  },
});

module.exports = {
  support,
  chatMsg,
  chatRoom,
  userProfile,
  post,
};
