const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const walletController = require('../controllers/wallet_controller');

router.post('/balance', wrapAsync(walletController.getBalance));
router.post('/billing', wrapAsync(walletController.billingMethod));
router.post('/withdraw', wrapAsync(walletController.withdraw));

module.exports = router;
