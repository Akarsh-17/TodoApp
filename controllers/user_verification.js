const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const OTP = require("../model/OTP");

module.exports = async (req, res) => {
  try {
    const {otp} = req.body;

    if (!otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are mandetory",
      });
    }

    const {name,email,password,image}=req.session.tempUser

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if(otp != recentOtp[0].otp)
    {
      return res.status(400).json({
        success: false,
        message: "otp invalid",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      image
    });
    
    res.redirect("/login")
    // return; 
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user can not be registered",
    });
  }
};