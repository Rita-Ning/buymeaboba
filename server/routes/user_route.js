const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const CompleteProfileController = require('../controllers/complete_profile_controller');
const UserController = require('../controllers/user_controller');

router.post('/user/login', wrapAsync(UserController.userLogin));
router.post('/user/signup', wrapAsync(UserController.userSignup));
router.post('/user/create', wrapAsync(CompleteProfileController.createUser));
router.get('/s3Url', wrapAsync(CompleteProfileController.getS3url));

module.exports = router;
