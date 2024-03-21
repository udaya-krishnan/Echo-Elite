const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    discripiton:{
        type:String,
        require:true
    },
    regularPrice:{
        type:Number,
        require:true
    },
    offerPrice:{
        type:Number,
        
    },
    stock:{
        type:Number,
        require:true
    },
  
    image:{
        type:Array,
        require:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories',
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    color:{
        type:String,
        require:true
    },
    is_blocked:{
        type:Boolean,
        require:true
    },rating:{
        type:Number,
        default:0
    }

},{versionKey:false})

module.exports=mongoose.model("product",productSchema)