const mongoose = require('mongoose');
const CompleteProfile = require('../models/complete_profile');
const { generateUploadURL } = require('../../util/s3');

async function getS3url(req, res) {
  const url = await generateUploadURL();
  res.send({ url });
}

async function createUser(req, res) {
  try {
    if (!req.body.user_name || !req.body.page_name) {
      return res.status(400).json({ error: 'Please Enter information needed' });
    }

    const profileInfo = {
      user_name: req.body.user_name,
      user_page: req.body.page_name,
      profile_pic: req.body.profile_pic,
      about: req.body.about,
      category: req.body.category,
      page_create: '1',
    };
    const checkPagename = await CompleteProfile.checkPageExist(
      req.body.page_name
    );

    if (checkPagename) {
      return res.status(400).json('This page has been registered');
    }
    userId = mongoose.mongo.ObjectId(req.body.user_id);
    await CompleteProfile.updateUserProfile(userId, profileInfo); //update profile info to db
    return res.status(200).json({ user_page: req.body.page_name });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
}

module.exports = { getS3url, createUser };
