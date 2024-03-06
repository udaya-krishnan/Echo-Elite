const mongoose=require("mongoose")

const order_schema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true,
    },
    userEmail:{
        type:String,
        require:true
    },
    orderNumber:{
        type:String,
        require:true,
        unique:true
    },
    items:[ 
        {
            productsId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
                require:true,
            },
            subTotal:{
                type:Number,
                require:true
            },
            quantity:{  
                type:Number,
                require:true
            },
        },
    ],

    totalAmount:{
        type:Number,
        require:true
    },
    orderType:{
        type:String,
        require:true
    },
    orderDate:{
        type:String,
        require:true
      
    },
    status:{
        type:String,
        require:true
    },
    shippingAddress:{
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
        altrenateMobile:{
            type:Number,
          
        },

    },
    coupon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"coupons"
    }

},{versionKey:false});

const order=mongoose.model("order",order_schema)
module.exports=order