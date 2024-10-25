const User = require("../model/User");
const bcrypt = require("bcrypt");

module.exports=async(req,res)=>{
    try{
      const  {email,password}=req.body;
  
      if(!email || !password)
      {
          return res.status(400).json({
              success:false,
              message:'Please fill all details'
          })
      }
  
      const user=await User.findOne({email})
  
      if(!user)
      {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        })
      }
  
  
      if(await bcrypt.compare(password,user.password))
      {
        req.session.is_logged_in = true;
        req.session.username = user.image;
        req.session.isAdmin=user.admin
        req.session.email=user.email
        console.log(user.image)
        console.log(req.session.username)
        res.redirect("/");
      }
      else{
        return res.render("login", { err: "** Invalid username or password" });
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
  
  
  