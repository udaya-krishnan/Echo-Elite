const mongoose=require("mongoose")


const addressSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    name:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    pinCode:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    district:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    landmark:{
        type:String,
        require:true
    },
    addressType:{
        type:String,
        require:true
    },
    alternateMobile:{
        type:Number,
        require:true
    }
},{versionKey:false})

module.exports=mongoose.model("address",addressSchema)