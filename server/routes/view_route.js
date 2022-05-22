const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const viewController = require('../controllers/view_controller');

router.post('/view/article', wrapAsync(viewController.saveViewarticle));
router.post('/view/page', wrapAsync(viewController.saveViewPage));
router.post('/visitorid', wrapAsync(viewController.createVisitorid));

module.exports = router;
