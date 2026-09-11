const express = require('express');
const router = express.Router();
const { userRegister, userLogin, adminLogin, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Authentication Routes
router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/user-login', userLogin);
router.post('/admin-login', adminLogin);
router.post('/logout', authMiddleware, logout);

module.exports = router;
