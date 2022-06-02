const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const TappayController = require('../controllers/support_controllers');
const LinepayController = require('../controllers/linepay_controller');

router.post('/support/checkout', wrapAsync(TappayController.tappay));
router.post('/linepay', wrapAsync(LinepayController.linepay));
router.post('/linepay/check', wrapAsync(LinepayController.linepayCheck));

module.exports = router;
