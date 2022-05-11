const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const crypto = require('crypto');
const { promisify } = require('util'); // util from native nodejs library
const aws = require('aws-sdk');
const randomBytes = promisify(crypto.randomBytes);

// const { upload } = require('../../util/multer');
// const path = require('path');
const { userProfile } = require('../../util/mongoose');

require('dotenv').config();

const region = 'ap-southeast-1';
const bucketName = 'buymeboba';
const accessKeyId = process.env.S3_ACCESSKEYID;
const secretAccessKey = process.env.S3_SECRET_ACCESSKEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: 'asset/profileImg/' + imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}

router.get('/s3Url', async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});
// const fields = upload.fields([{ name: 'profile_img', maxCount: 1 }]);

router.post('/user/create', async (req, res) => {
  try {
    if (!req.body.user_name || !req.body.page_name) {
      return res.status(400).json({ error: 'Please Enter information needed' });
    }

    // if (!req.files.profile_img) {
    //   picturePath = 'default';
    // } else {
    //   picturePath = req.files.profile_img[0].path.replace(
    //     'public/',
    //     process.env.DNS
    //   );
    // }

    // const profileInfo = {
    //   user_name: req.body.user_name,
    //   user_page: req.body.page_name,
    //   profile_pic: picturePath.replace('public/', ''),
    //   about: req.body.about,
    //   page_create: '1',
    // };
    const profileInfo = {
      user_name: req.body.user_name,
      user_page: req.body.page_name,
      profile_pic: req.body.profile_pic,
      about: req.body.about,
      category: req.body.category,
      page_create: '1',
    };
    console.log(profileInfo);
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
    // console.log(result);
    return res.status(200).json({ user_page: req.body.page_name });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
