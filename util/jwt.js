const util = require('util');
const jwt = require('jsonwebtoken');

jwt.verifyAsync = util.promisify(jwt.verify);

module.exports = jwt;
