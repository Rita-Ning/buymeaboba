const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const CompleteProfileController = require('../controllers/completeProfile_controller');
const userController = require('../controllers/user_controller');

router.post('/user/login', wrapAsync(userController.userLogin));
router.post('/user/signup', wrapAsync(userController.userSignup));
router.post('/user/create', wrapAsync(CompleteProfileController.createUser));
router.get('/s3Url', wrapAsync(CompleteProfileController.getS3url));

module.exports = router;
