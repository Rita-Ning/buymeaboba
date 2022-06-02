const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const ViewController = require('../controllers/view_controller');

router.post('/view/article', wrapAsync(ViewController.saveViewarticle));
router.post('/view/page', wrapAsync(ViewController.saveViewPage));
router.post('/visitorid', wrapAsync(ViewController.createVisitorid));

module.exports = router;
