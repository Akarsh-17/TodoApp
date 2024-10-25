const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const OTP = require("../model/OTP");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already exists",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });
    let result = OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        lowerCaseAlphabets: true,
        specialChars: false,
      });
    }

    const otpPayload = OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      otp,
      message: "otp generated successfully",
    });
  } catch (error) {
    console.log("error in sending otp ", error);
    res.status(500).json({
      success: true,
      message: "error in sending otp ",
    });
  }
};

exports.singUp = async (req, res) => {
  try {
    const { 
      name,
      email,
      password, 
      confirmPassword, 
      otp } = req.body;

    if (!name || !email || !password || !confirmPassword || !otp) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User is successfully registerd as BUYER",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user can not be registered",
    });
  }
};


exports.login=async(req,res)=>{
  try{
    const  {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({
            success:false,
            message:'Please fill all details'
        })
    }

    const user=await User.find({email})

    if(!user)
    {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const payload={
      email,
      id:user._id,
      isAdmin:user.admin
    }


    if(bcrypt.compare(password,user.password))
    {
      const token= await jwt.sign(payload,
        process.env.JWT_SECRET,{
          expiresIn:'48h'
        }
      )
      user.password=undefined

      const options = {
        httpOnly: false,  // Ensures the cookie is sent only over HTTP(S), not accessible by JavaScript
        // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),  // Corrected from expiresIN to expires
        secure: true,  // Ensures the cookie is sent over HTTPS only
        sameSite: 'None',  // Needed if your frontend and backend are not on the same domain
        domain:'.localhost',
        //  maxAge: 60000 //1 min
        maxAge: 172800000 //2 days
      };
  
      res.cookie("token",token,options).status(200).json({
          success:true,
          message:'User looged in successfully',
          user
      })
    }
    else{
      return res.status(401).json({
        success: false,
        message:"Invalid user password"
      })
    }

  }
  catch(error)
  {
    console.log(error)
    return res.status(500).json({
      success: false,
      message:"login failure"
    })
  }
}


