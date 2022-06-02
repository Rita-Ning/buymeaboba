const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const WalletController = require('../controllers/wallet_controller');

router.post('/balance', wrapAsync(WalletController.getBalance));
router.post('/billing', wrapAsync(WalletController.billingMethod));
router.post('/withdraw', wrapAsync(WalletController.withdraw));

module.exports = router;
