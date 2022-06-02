const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const CreatorController = require('../controllers/creator_controller');

router.post('/follow/add', wrapAsync(CreatorController.addFollow));

router.post('/follow/delete', wrapAsync(CreatorController.deleteFollow));

router.get('/creator/:name', wrapAsync(CreatorController.getCreatorPage));

// router.get('/creator', wrapAsync(creatorController.getCreator));

module.exports = router;
