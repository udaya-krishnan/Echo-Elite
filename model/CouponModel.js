const mongoose=require("mongoose")

const couponSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    startDate:{
        type:String,
        require:true,
    },
    EndDate:{
        type:String,
        require:true
    },
    minimumAmount:{
        type:Number,
        require:true,
    },
    maximumAmount:{
        type:Number,
        require:true
    },
    discount:{
        type:Number,
        require:true
    },
    couponCode:{
        type:String,
        require:true,
    },
    users:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
        }
    }
    ],
    isActive:{
        type:Boolean,
        default:true
    }
},{versionKey:false})

module.exports=mongoose.model("coupon",couponSchema)