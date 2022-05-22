require('dotenv').config({ path: `${__dirname}/../../.env` });
const bcrypt = require('bcrypt');
const jwt = require('../../util/jwt');
const User = require('../models/user_model');

const saltRounds = parseInt(process.env.BCRYPT_SALT);
const { SECRET } = process.env;
const expireTime = '12h';

async function userSignup(req, res) {
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
    function IsEmail(email) {
      const regex = /\S+@\S+\.\S+/;
      if (!regex.test(email)) {
        return false;
      }
      return true;
    }
    // check if user input is correct
    const checkEmail = await User.checkEmail(email);
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
    await User.createUserinfo(userInfo);

    let data = await User.getUserIdentity(email);

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
    res.send(userJson);
  } catch (error) {
    next(error);
  }
}

async function userLogin(req, res) {
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
      const checkEmail = await User.checkEmail(email);

      if (checkEmail.length === 0) {
        return res.status(400).json({ error: 'Please sign up first !' });
      }
      const myHash = await User.getUserPassword(email);

      const passwordCheck = bcrypt.compareSync(password, myHash.password);

      if (passwordCheck === false) {
        return res
          .status(400)
          .json({ error: 'Signed in with Incorrect info!' });
      }

      // Response Format
      let data = await User.getUserInfo(email);
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
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { userSignup, userLogin };
