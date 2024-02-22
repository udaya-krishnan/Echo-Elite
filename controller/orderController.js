const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const Order=require("../model/orderModel")


const loadViewOrder=async(req,res)=>{
    try {
        const id=req.query.id
        const findOrder=await Order.findById({_id:id})
        console.log(findOrder)

        const proId=[]

        for(let i=0;i<findOrder.items.length;i++){
            proId.push(findOrder.items[i].productsId)
        }

        const proData=[]

        for(let i=0;i<proId.length;i++){
            proData.push(await Product.findById({_id:proId[i]}))
        }

        res.render("orderView",{proData,findOrder})
    } catch (error) {
        console.log(error.message);
        
    }
}

 const cancelOrder=async(req,res)=>{
    try {

        const id=req.body.id

        const findOrder=await Order.findById({_id:id})

        const updateOrder=await Order.findByIdAndUpdate({_id:id},{
            $set:{
                status:"Canceled"
            }
        })

        const proId=[]

        for(let i=0;i<findOrder.items.length;i++){
            proId.push(findOrder.items[i].productsId)
        }

        for(let i=0;i<proId.length;i++){

            await Product.findByIdAndUpdate({_id:proId[i]},
                {
                    $inc:{
                        stock:findOrder.items[i].quantity
                    }
                })

        }

        res.json({status:true})

        
    } catch (error) {
        console.log(error.message)
    }
 }



 //*************************************************ADMIN SIDE********************** */


 const loadOrder=async(req,res)=>{
    try {
        const orderData=await Order.find({})

        res.render("adminOrder",{orderData})
    } catch (error) {
        console.log(error.message)
    }
 }


module.exports={
    loadViewOrder,
    cancelOrder,
    loadOrder
}
