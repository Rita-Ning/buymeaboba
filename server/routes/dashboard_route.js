const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const DashboardController = require('../controllers/dashboard_controller');

router.post(
  '/dashboard/normal',
  wrapAsync(DashboardController.createDashboard)
);

module.exports = router;
