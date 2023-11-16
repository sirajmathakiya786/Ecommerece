const jwt = require('jsonwebtoken');
const User = require('../models/users');

const verifyJwtToken = async(req, res, next) => {
    const token = req.headers["token"];
    if (token == null) return res.sendStatus(401);
    
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isUserExists = await User.findOne({
        _id: verified?._id,
    })

    if (verified && isUserExists) {
      req.user = verified;
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Token Expired",
    });
  }
}

const sellerVerifyJwtToken = async(req, res, next) => {
  const token = req.headers["token"];
  if (token == null) return res.sendStatus(401);
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isUserExists = await User.findOne({
        _id: verified?._id,
    })
    if (verified && isUserExists) {
      if(isUserExists.role === 'seller'){
        req.user = verified;
        next();
      }else{
        return res.status(403).send({
          success: false,
          message: "Access denied. You are not seller"
        })
      }
      
    } else {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Token Expired",
    });
  }
}

const adminVerifyJwtToken = async(req, res, next) => {
  const token = req.headers["token"];
  if (token == null) return res.sendStatus(401);
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isUserExists = await User.findOne({
        _id: verified?._id,
    })
    if (verified && isUserExists) {
      if(isUserExists.role === 'admin'){
        req.user = verified;
        next();
      }else{
        return res.status(403).send({
          success: false,
          message: "Access denied. You are not admin"
        })
      }
      
    } else {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Token Expired",
    });
  }
}

module.exports = { verifyJwtToken,sellerVerifyJwtToken,adminVerifyJwtToken };