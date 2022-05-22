const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const creatorController = require('../controllers/creator_controller');

router.post('/follow/add', wrapAsync(creatorController.addFollow));

router.post('/follow/delete', wrapAsync(creatorController.deleteFollow));

router.get('/creator/:name', wrapAsync(creatorController.getCreatorPage));

// router.get('/creator', wrapAsync(creatorController.getCreator));

module.exports = router;
