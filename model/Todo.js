const mongoose=require("mongoose")
const { type } = require("os")

const todoSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    todoName:{
        type:String,
        required:true,
    },
    checked:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("Todo",todoSchema)