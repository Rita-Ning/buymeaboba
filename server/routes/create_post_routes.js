const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const SavePostController = require('../controllers/save_post_controller');

router.post('/post/create', wrapAsync(SavePostController.createPost));

module.exports = router;
