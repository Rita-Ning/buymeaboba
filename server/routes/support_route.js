const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const tappayController = require('../controllers/support_controllers');
const linepayController = require('../controllers/linepay_controller');

router.post('/support/checkout', wrapAsync(tappayController.tappay));
router.post('/linepay', wrapAsync(linepayController.linepay));
router.post('/linepay/check', wrapAsync(linepayController.linepayCheck));

module.exports = router;
