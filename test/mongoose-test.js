const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://52.21.239.102:27017/test', {
  authSource: 'admin',
  user: 'RitaAppworks',
  pass: 'Rita0209!',
});

const User = mongoose.model('User', {
  name: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Bad password setting');
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email');
      }
    },
  },
});

const me = new User({
  name: '   Andy',
  age: 29,
  email: 'andy@gmaIl.com  ',
  password: '    happy12345     ',
});

me.save()
  .then(() => {
    console.log(me);
  })
  .catch((error) => {
    console.log('error', error);
  });

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
  },
});

const task = new Task({
  description: 'eat',
  completed: false,
});

// task
//   .save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch(() => {
//     console.log('error', error);
//   });
