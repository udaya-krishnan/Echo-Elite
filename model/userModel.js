const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    DOB:{
        type:String
       
    },
    gender:{
        type:String
       
    },
    is_verified:{
        type:Number,
        default:0
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    referralCode:{
        type:String,
    }
},{versionKey:false})

module.exports=mongoose.model("User",userSchema)