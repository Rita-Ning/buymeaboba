const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const FollowPostController = require('../controllers/follow_post_controller');

router.post('/newsfeed', wrapAsync(FollowPostController.getNewsfeed));
router.post('/newsfeed/search', wrapAsync(FollowPostController.newsfeedSearch));

module.exports = router;
