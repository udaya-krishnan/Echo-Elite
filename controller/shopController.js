const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");
const Adderss=require("../model/addressModel")
const Cart=require("../model/cartModel")
const Order =require("../model/orderModel")

const loadWithlowtoHigh=async(req,res)=>{
    try {

       const proData=await Product.find({}).sort({offerPrice:1})

    //    const proData=await Product.find({})

    const catData=await Category.find({})
    const newPro=await Product.find({}).sort({_id:-1}).limit(3)
    const brandData= await Brand.find({})

      
    res.render("shop",{proData,catData,newPro,brandData})
    
        
    } catch (error) {
        console.log(error.message)
    }
}




module.exports={
    loadWithlowtoHigh
}