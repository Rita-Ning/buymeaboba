require('dotenv').config();
const aws = require('aws-sdk');
const { promisify } = require('util'); // util from native nodejs library
const crypto = require('crypto');
const randomBytes = promisify(crypto.randomBytes);

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

module.exports = {
  generateUploadURL,
};
