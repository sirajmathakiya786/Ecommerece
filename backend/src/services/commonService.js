const bcrypt = require('bcrypt');

const passwordEncypt = async (password)=>{
    let salt = await bcrypt.genSalt(10);
    let passwordHash = bcrypt.hash(password, salt);
    return passwordHash;
}

const validatePassword = (password)=>{
    const pattern = /^[^\s]{6,10}$/;
    return pattern.test(password);
}

function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 6;
    let code = '';
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
}
  
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}
  
const otpExpireTime = ()=>{
    const expiry = Date.now() + 2 * 60 * 1000;
    const expiryIST = new Date(expiry).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
    return expiryIST;
}

const calculateTotalPrice = async (products) => {
    let totalPrice = 0;

    for (const product of products) {
        // Multiply product price by quantity
        totalPrice += product.price;
    }

    return totalPrice;
};


module.exports = { passwordEncypt,validatePassword,generateReferralCode,otpExpireTime,generateOTP,calculateTotalPrice }