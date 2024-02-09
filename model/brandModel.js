const mongoose=require("mongoose")

const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    }
},{versionKey:false})

module.exports=mongoose.model("brand",brandSchema)