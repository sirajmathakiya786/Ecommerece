const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const upload = require('../middleware/fileUpload');
const { usersSchema } = require('../services/validation/usersValidation');
const validateRequest = require('../middleware/bodyErrorSender');

router.post('/add', upload,user.addUser);
router.post('/login', user.loginUser);
router.patch('/update/:userId', upload,user.updateUser);
router.post('/forgot-password', user.forgotPassword);
router.post('/verify-otp', user.verifyOtp);
router.patch('/change-password/:userId', user.changePassword);
router.put('/reset-password/:userId', user.resetPassword);
router.get('/render-login', user.renderLogin);
router.get('/get-user', user.getAllUser);

module.exports = router;