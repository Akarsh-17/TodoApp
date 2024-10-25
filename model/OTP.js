const mongoose=require("mongoose")
const { type } = require("os")
const mailSender = require("../utils/mailSender")

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

async function sendVerificationMail(email,otp)
{
    try{
        const mailResponse=await mailSender(email,'Account Verification for Todo',
                                            otp)
                                            
        console.log("email send successfully", mailResponse)
    }
    catch(error){
        console.log(error)
        console.log("error occured while sending mail",error)
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    if(this.isNew)
    {
        await sendVerificationMail(this.email,this.otp)
    }
    next()
})

module.exports=mongoose.model("OTP",otpSchema)