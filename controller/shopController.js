const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");
const Adderss=require("../model/addressModel")
const Cart=require("../model/cartModel")
const Order =require("../model/orderModel")

const loadWithCatName=async(req,res)=>{
    try {

        const id =req.body.catId
        const findCat=await Category.findById({_id:id})

    
        
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    loadWithCatName
}