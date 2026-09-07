const express = require('express');
const router = express.Router();
const { userLogin, adminLogin, logout } = require('../controllers/authController');

router.post('/user-login', userLogin);
router.post('/admin-login', adminLogin);
router.post('/logout', logout);

module.exports = router;
