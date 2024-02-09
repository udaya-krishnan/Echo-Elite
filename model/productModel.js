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
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    offPercentage:{
        type:Number,
        require:true
    },
    image:{
        type:Array,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    color:{
        type:String,
        require:true
    }

},{versionKey:false})

module.exports=mongoose.model("product",productSchema)