const express = require('express');
const router = express.Router();
const { userLogin, adminLogin } = require('../controllers/authController');

router.post('/user-login', userLogin);
router.post('/admin-login', adminLogin);

module.exports = router;
