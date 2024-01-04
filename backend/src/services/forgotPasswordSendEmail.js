const sgMail = require('@sendgrid/mail');
require("dotenv").config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const forgotPasswordSendEmail = async (email, otpCode)=>{
    const msg = { 
        to:email,
        from: process.env.SENDGRID_USER_FROM,
        subject:'Password Reset OTP',
        text:'Your OTP for password reset is:${otpCode}',
        html:`<p>Your OTP for password reset is: <strong>${otpCode}</strong></p>`
    }

    try {
        await sgMail.send(msg);
        console.log('Email Sent Successfully');
    } catch (error) {
        console.error('Error Sending email:', error);
    }
}

module.exports = forgotPasswordSendEmail;