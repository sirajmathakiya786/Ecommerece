const User = require("../models/users");
const {
  passwordEncypt,
  generateReferralCode,
  generateOTP,
  otpExpireTime,
} = require("../services/commonService");
const forgotPasswordSendEmail = require("../services/forgotPasswordSendEmail");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      refer,
      role
    } = req.body;
    let passwordHash = await passwordEncypt(password);
    let referralCode = generateReferralCode();
    console.log(refer);
    const referringUser = await User.findOne({ referalCode: refer });
    if (!referringUser) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid referral code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email already exists",
        });
    }

    const userData = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phoneNumber,
      referalCode: referralCode,
      refer,
      referedBy: referringUser._id,
      rewards: 0,
      profileImage: req.file.filename,
      role
    });

    userData
      .save()
      .then(async (data) => {
        referringUser.rewards += 1;
        await referringUser.save();

        return res.status(201).json({
          success: true,
          message: "User Created Successfully",
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "User Not Created!",
          err: err,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async(req,res)=>{
  try {
    const { email,password } = req.body;
    if(!email || !password){
      return res.status(400).json({ success: false, message: "UserName and password are required"})
    }    
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(400).json({ success: false, message: "User Not Found" });
    }
    if(!bcrypt.compareSync(password, user.password)){
      return res.status(401).json({ success: false, message: "Invalid Password"})
    }
    const token = jwt.sign({ _id:user._id, firstName:user.firstName}, process.env.JWT_SECRET_KEY,{
      expiresIn: '11h'
    });
    return res.status(200).send({ 
      success: true, 
      message:"Login Successfully", 
      user:{
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const { firstName, lastName, email, phoneNumber } = req.body;
    const userProfilePicPath = req?.file?.filename;
    // if (!req?.file) {
    //   console.log("No image uploaded, proceeding with data update only");
    // }
    
    // if (!userProfilePicPath || !req?.file?.originalname) {
    //   return res.status(200).send({
    //     success: false,
    //     message: "You are not uploaded image",
    //   });
    // }
    const findById = await User.findOne({ _id: userId });
    if (!findById) {
      return res.status(400).send({
        success: false,
        message: "User Not Found",
      });
    } else {
      const profileImageUrl = findById.profileImage;
      console.log(profileImageUrl,"profileImageUrl",findById)
      if (profileImageUrl) {
        fs.unlink("./public/uploads/" + profileImageUrl, (err) => {
          if (err) {
            console.log("Error while deleting old image:", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
      }
    }
    const updatedUserData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      // profileImage: userProfilePicPath,
    };

    User.findByIdAndUpdate(userId, { $set: updatedUserData }, { new: true })
      .then((result) => {
        return res.status(200).json({
          success: true,
          message: "User Data Updated Successfully",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          message: "User Data Not Updated.",
          err: err,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res
        .status(404)
        .send({ success: false, message: "Email Not found" });
    }
    const otpExpire = new Date();
    const otpCode = generateOTP();
    const otp = await User.findByIdAndUpdate(
      { _id: checkEmail._id },
      { $set: { otp: otpCode, otpExpire: otpExpire } },
      { new: true }
    );
    await forgotPasswordSendEmail(email, otpCode);
    return res.status(200).json({
      success: true,
      message: "Otp Send Successfully in your email",
      otp: otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpData = await User.findOne({ email, otp });
    if (otpData) {
      const otpTimestamp = new Date(otpData.otpExpire);
      const otpExpirationTime = new Date(
        otpTimestamp.getTime() + 2 * 60 * 1000
      );
      const currentTime = new Date();
      // console.log('otpTimestamp:', otpTimestamp);
      // console.log('otpExpirationTime:', otpExpirationTime);
      // console.log('currentTime:', currentTime);

      if (currentTime <= otpExpirationTime) {
        res
          .status(200)
          .json({ success: true, message: "OTP verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "OTP has expired" });
      }
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const users = req.user
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: users._id });
    
    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old Password is Incorrect",
      });
    }
    const checkNewPassword = await bcrypt.compare(newPassword, user.password);
    if (checkNewPassword) {
      return res.status(400).json({
        success: false,
        message: "NewPassword and OldPassword are match",
      });
    }
    const passwordHash = await passwordEncypt(newPassword, user.password);
    const updatePassword = await User.findByIdAndUpdate(
      { _id: users._id },
      { $set: { password: passwordHash } },
      { new: true }
    )
      .then((updatePassword) => {
        return res.status(200).json({
          success: true,
          message: "Password has been successfully updated",
          data: updatePassword,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          message: "Password Not updated",
          err: err,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { otp, oldPassword, newPassword } = req.body;
    const checkOtp = await User.findOne({ otp });
    if (!checkOtp) {
      return res
        .status(400)
        .json({ success: false, message: "You provided invalid otp" });
    }
    const oldPasswordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!oldPasswordCheck) {
      return res
        .status(404)
        .json({ success: false, message: "OldPassword is wrong" });
    }
    const checkNewPassword = await bcrypt.compare(newPassword, user.password);
    if (checkNewPassword) {
      return res
        .status(404)
        .json({
          success: false,
          message: "OldPassword and NewPassword are same",
        });
    }
    const passwordHash = await passwordEncypt(newPassword, user.password);
    const updatePassword = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: passwordHash } },
      { new: true }
    )
      .then((updatePassword) => {
        return res.status(200).json({
          success: true,
          message: "Password Updated Successfully",
          data: updatePassword,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          message: "Password Not Updated! Please try again",
          err: err,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getAllUser = async(req,res)=>{
  try {
    User.find({}).select('firstName lastName email phoneNumber rewards role profileImage').then((result)=>{
      const baseUrl = 'http://localhost:6060/images/';
      const usersWithImageUrl = result.map(user => {
        return {
          ...user._doc,
          profileImageUrl: baseUrl + user.profileImage
        };
      });

      console.log(usersWithImageUrl);
      return res.status(200).json({
        success: true,
        message: "All User",
        data: usersWithImageUrl
      })
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
}


async function renderLogin (req,res){

  try {
      res.render('login');

  } catch (error) {
      console.log(error.message);
  }

}

module.exports = {
  addUser,
  forgotPassword,
  verifyOtp,
  changePassword,
  resetPassword,
  updateUser,
  loginUser,
  renderLogin,
  getAllUser
};
