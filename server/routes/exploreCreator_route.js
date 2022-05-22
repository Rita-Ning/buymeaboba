const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const ExploreCreatorController = require('../controllers/exploreCreator_controller');

router.get('/search', wrapAsync(ExploreCreatorController.search));

router.get(
  '/search/frontpage',
  wrapAsync(ExploreCreatorController.recommendHome)
);

module.exports = router;
