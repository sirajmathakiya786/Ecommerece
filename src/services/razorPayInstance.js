const RazorPay = require('razorpay');

const razorpay = new RazorPay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


module.exports = razorpay;