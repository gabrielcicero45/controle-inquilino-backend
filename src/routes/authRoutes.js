const express = require('express');
const { login, register, getUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, getUser);

module.exports = router;
