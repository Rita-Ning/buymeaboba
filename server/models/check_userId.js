require('dotenv').config();
const jwt = require('../../util/jwt');
const { SECRET } = process.env;

async function checkUserid(req, res, next) {
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
  if (admin !== 1) {
    return res
      .status(400)
      .json({ error: 'Please make sure you have admin permission.' });
  }
  return next();
}

module.exports = { checkUserid };
