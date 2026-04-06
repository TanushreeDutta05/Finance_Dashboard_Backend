const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate, userValidation } = require('../middlewares/validation');
const { authLimiter } = require('../middlewares/rateLimiter');


router.post('/register', authLimiter, userValidation.register, validate, register);
router.post('/login', authLimiter, validate, login);
router.get('/me', protect, getMe);


module.exports = router;