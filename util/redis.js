require('dotenv').config({ path: `${__dirname}/../.env` });
const redis = require('redis');

const client = redis.createClient({
  url: process.env.redis_url,
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = { client };
