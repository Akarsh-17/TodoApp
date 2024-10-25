const User = require("../model/User");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const OTP = require("../model/OTP");

module.exports=async(req,res)=>{
    try {
          console.log("hello")
          const { 
            username,
            email,
            password, 
            confirmPassword, 
          } = req.body;

          console.log(req.body)
          console.log(req.file)
         
        if (!username || !email || !password || !confirmPassword) {
          return res.status(403).json({
            success: false,
            message: "All fields are mandetory",
          });
        }

        if (password !== confirmPassword) {
          return res.status(401).json({
            succes: false,
            message: "Confirm Password and Password does not not match",
          });
        }
        else{
          console.log("true")
        }    

        const exsistingUser = await User.findOne({ email });
        
        if (exsistingUser) {
          console.log(exsistingUser)
          return res.status(400).json({
            success: false,
            message: "User Already exists",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: true,
          specialChars: false,
          digits:true
        });

        let result =await  OTP.findOne({ otp });

        while (result) {
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: true,
            specialChars: false,
            digits:true
          });
        }
        console.log(otp)
        const otpPayload = OTP.create({ email, otp });

        req.session.tempUser = {
            email: email,
            password: hashedPassword,
            name:username,
            image:req.file.filename
        };
        
        res.render("otpVerification");
      } catch (error) {
        console.log("error in sending otp ", error);
        res.status(500).json({
          success: true,
          message: "error in sending otp ",
        });
      }
}