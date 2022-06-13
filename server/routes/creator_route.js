const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const CreatorController = require('../controllers/creator_controller');

router.post('/follow', wrapAsync(CreatorController.addFollow));

router.delete('/follow', wrapAsync(CreatorController.deleteFollow));

router.get('/creator/:name', wrapAsync(CreatorController.getCreatorPage));

// router.get('/creator', wrapAsync(creatorController.getCreator));

module.exports = router;
