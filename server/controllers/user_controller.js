require('dotenv').config({ path: `${__dirname}/../../.env` });
const express = require('express');
const axios = require('axios');

const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('../../util/jwt');
const { userProfile } = require('../../util/mongoose');

const saltRounds = parseInt(process.env.BCRYPT_SALT);
const { SECRET } = process.env;
const expireTime = '12h';

router.post('/user/signup', async (req, res, next) => {
  // check header
  if (req.headers['content-type'] !== 'application/json') {
    return res
      .status(400)
      .json({ error: 'Content type need to be application/json' });
  }
  // check if user input is correct
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Please Enter all information needed !' });
  }
  const passwordC = bcrypt.hashSync(password, saltRounds);
  let userInfo;
  try {
    if (email === 'RitaAppworks@appwork.com') {
      userInfo = {
        provider: 'native',
        email,
        password: passwordC,
        is_admin: '1',
      };
    } else {
      userInfo = {
        provider: 'native',
        email,
        password: passwordC,
        is_admin: '0',
      };
    }
    // check if email is valid
    // eslint-disable-next-line no-inner-declarations
    function IsEmail(email) {
      const regex = /\S+@\S+\.\S+/;
      if (!regex.test(email)) {
        return false;
      }
      return true;
    }
    // check if user input is correct
    const checkEmail = await userProfile.find({ email: email });
    if (IsEmail(email) === false) {
      return res
        .status(400)
        .json({ error: 'Please Enter valid email address !' });
    }
    if (checkEmail.length != 0) {
      return res
        .status(400)
        .json({ error: 'This email has been registered !' });
    }
    await userProfile.create(userInfo);

    let data = await userProfile
      .findOne({ email: email })
      .select('_id is_admin');
    const token = jwt.sign(
      {
        user_id: data._id,
        admin: data.is_admin,
      },
      SECRET,
      {
        expiresIn: expireTime,
      }
    );
    const userJson = {
      data: {
        access_token: token,
        access_expired: expireTime,
        user: data._id,
      },
    };
    // console.log(userJson);
    res.send(userJson);
  } catch (error) {
    next(error);
  }
});

router.post('/user/login', async (req, res, next) => {
  try {
    const { provider } = req.body;
    if (provider === 'native') {
      // check header
      if (req.headers['content-type'] !== 'application/json') {
        return res
          .status(400)
          .json({ error: 'Content type need to be application/json' });
      }
      // check if user input is correct
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Please Enter all information needed !' });
      }
      const checkEmail = await userProfile.find({ email: email });

      if (checkEmail.length === 0) {
        return res.status(400).json({ error: 'Please sign up first !' });
      }
      const myHash = await userProfile.findOne(
        { email: email },
        { password: 1 }
      );
      console.log(myHash);
      const passwordCheck = bcrypt.compareSync(password, myHash.password);

      if (passwordCheck === false) {
        return res
          .status(400)
          .json({ error: 'Signed in with Incorrect info!' });
      }

      // Response Format
      let data = await userProfile
        .findOne({ email: email })
        .select('_id is_admin page_create user_page');

      console.log(data);
      const token = jwt.sign(
        {
          user_id: data._id,
          admin: data.is_admin,
        },
        SECRET,
        {
          expiresIn: expireTime,
        }
      );
      const userJson = {
        data: {
          access_token: token,
          access_expired: expireTime,
          user: data._id,
          page_create: data.page_create,
          user_page: data.user_page,
        },
      };
      // check if sign in success
      res.send(userJson);
    } else if (provider === 'facebook') {
      // Fb log in
      const fbToken = req.body.access_token; // get access token from FB
      const { data } = await axios({
        // send info back to FB and recieve data
        url: `https://graph.facebook.com/v13.0/me?fields=name,email,picture&access_token=${fbToken}`,
        method: 'get',
      });
      // check if log in error
      if (data.error) {
        return res
          .status(403)
          .json({ error: 'Signed in with Incorrect info!' });
      }
      // Save data to DB
      const { email, name, picture } = data;
      // Download profile pic from fb
      // eslint-disable-next-line no-inner-declarations
      async function download() {
        const { url } = picture.data;
        const filePath = path.resolve(
          __dirname,
          '../public/uploads_fb/',
          `${name}.jpg`
        );

        const response = await axios({
          method: 'get',
          url,
          responseType: 'stream',
        });
        response.data.pipe(fs.createWriteStream(filePath));
        return new Promise((resolve, reject) => {
          response.data.on('end', () => {
            resolve();
          });
          response.data.on('error', (err) => {
            reject(err);
          });
        });
      }

      download().then(() => {
        console.log('download finish');
      });

      const checkEmail = await query(
        `SELECT * FROM user WHERE email = '${email}'`
      );
      if (checkEmail.length === 0) {
        const userInfo = {
          provider: 'facebook',
          name,
          email,
          picture: `uploads_fb/${name}.jpg`,
          admin: 0,
        };

        const result = await query('INSERT INTO user SET ?', userInfo);
        console.log(result);
        const [data] = await query(
          `SELECT * FROM user WHERE email = '${email}'`
        );
        const token = jwt.sign({ id: data.id, admin: data.admin }, SECRET, {
          expiresIn: 60 * 60,
        }); // generate our own token
        delete data.password;
        delete data.admin;

        const userJson = {
          data: {
            access_token: token,
            access_expired: expireTime,
            user: data,
          },
        };
        res.send(userJson);
      } else {
        const [data] = await query(
          `SELECT id, provider, name, email, picture FROM user WHERE email = '${email}'`
        );
        const token = jwt.sign({ id: data.id, admin: data.admin }, SECRET, {
          expiresIn: 60 * 60,
        }); // generate our own token
        delete data.password;
        delete data.admin;
        const userJson = {
          data: {
            access_token: token,
            access_expired: expireTime,
            user: data,
          },
        };
        res.send(userJson);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get('/user/profile', async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    const tokenUse = token.replace('Bearer ', '');
    try {
      var decoded = await jwt.verifyAsync(tokenUse, SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Wrong token' });
    }

    const { admin } = decoded;
    const [data] = await query(`SELECT * FROM user WHERE id = '${decoded.id}'`);
    delete data.id;
    delete data.password;
    delete data.admin;

    const userJson = {
      data,
    };

    const sendInfo = { userJson, admin };

    res.send(sendInfo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
