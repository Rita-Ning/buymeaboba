const express = require('express');
var mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();
const { upload } = require('../../util/multer');
const path = require('path');
const { userProfile } = require('../../util/mongoose');

const fields = upload.fields([{ name: 'profile_img', maxCount: 1 }]);

router.post('/user/create', fields, async (req, res) => {
  console.log(req.body);
  // console.log(req.files);
  if (!req.body.user_name || !req.body.page_name) {
    return res.status(400).json({ error: 'Please Enter information needed' });
  }

  if (!req.files.profile_img) {
    picturePath = 'default';
  } else {
    picturePath = req.files.profile_img[0].path.replace(
      'public/',
      process.env.DNS
    );
  }

  const profileInfo = {
    user_name: req.body.user_name,
    user_page: req.body.page_name,
    profile_pic: picturePath.replace('public/', ''),
    about: req.body.about,
    page_create: '1',
  };
  try {
    const checkPagename = await userProfile.findOne({
      user_page: req.body.page_name,
    });
    if (checkPagename) {
      return res.status(400).json('This page has been registered');
    }
    userId = mongoose.mongo.ObjectId(req.body.user_id);
    const result = await userProfile.findOneAndUpdate(
      { _id: userId },
      profileInfo,
      { new: true }
    );
    console.log(result);
    return res.status(200).json({ user_page: req.body.page_name });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
