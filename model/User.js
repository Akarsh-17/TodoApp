const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },

    // todos:{
    //     type:[mongoose.Schema.Types.ObjectId],
    //     ref:"Todo"
    // },
    admin:{
      type:Boolean,
      default:false
    },
    deleteByAdmin:{
        type:Boolean,
        defalut:false
    }
},
{timestamps:true}
)

module.exports=mongoose.model("User",userSchema);