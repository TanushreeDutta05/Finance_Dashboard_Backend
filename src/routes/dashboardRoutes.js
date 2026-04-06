const express = require('express');
const router = express.Router();
const { getDashboardSummary, getMonthlyTrends, getCategoryInsights } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const { roleCheck } = require('../middlewares/roleCheck');


router.use(protect);
router.use(roleCheck('viewer', 'analyst', 'admin'));


router.get('/summary', getDashboardSummary);
router.get('/trends', getMonthlyTrends);
router.get('/insights', getCategoryInsights);


module.exports = router;