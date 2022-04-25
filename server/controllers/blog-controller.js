const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();
const { userProfile, post } = require('../../util/mongoose');

router.get('/user/:name', async (req, res) => {});

module.exports = router;
