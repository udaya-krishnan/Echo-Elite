const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const Order=require("../model/orderModel")

const generateDate=require("../controller/dateGenrator")


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
        const orderData=await Order.find({}).sort({_id:-1})

        res.render("adminOrder",{orderData})
    } catch (error) {
        console.log(error.message)
    }
 }

 const loadOrderDetail=async(req,res)=>{
    try {
        const id=req.query.id
        const findOrder=await Order.findById({_id:id})

        let proId=[];
        for(let i=0;i<findOrder.items.length;i++){
            proId.push(findOrder.items[i].productsId)
        }

        let proData=[]

        for(let i=0;i<proId.length;i++){
            proData.push(await Product.findById({_id:proId[i]}))
        }


        res.render("detailOrder",{findOrder,proData})
    } catch (error) {
        console.log(error.message)
    }
 }

 const saveOrder=async(req,res)=>{
    try {
     
        const {status,id}=req.body

        console.log(id,status)

       const checking=await Order.findById({_id:id})

       
       if(checking.status==status){
        res.json({status:"notChanged"})
       }else{

        const updateStatus=await Order.findByIdAndUpdate({_id:id},{
            $set:{
                status:status
            }
        })

       }
       if(status=="Returned"){

        const proId=[]

        for(let i=0;i<checking.items.length;i++){
            proId.push(checking.items[i].productsId)
        }

        for(let i=0;i<proId.length;i++){

            await Product.findByIdAndUpdate({_id:proId[i]},
                {
                    $inc:{
                        stock:checking.items[i].quantity
                    }
                })

        }

       }else if(status=="Canceled"){

        const updateOrder=await Order.findByIdAndUpdate({_id:id},{
            $set:{
                status:"Canceled"
            }
        })

        const proId=[]

        for(let i=0;i<checking.items.length;i++){
            proId.push(checking.items[i].productsId)
        }

        for(let i=0;i<proId.length;i++){

            await Product.findByIdAndUpdate({_id:proId[i]},
                {
                    $inc:{
                        stock:checking.items[i].quantity
                    }
                })

        }

       }

       res.json({status:true})

       

    } catch (error) {
        console.log(error.message)
    }
 }

 const returnRequest=async(req,res)=>{
    try {

        const reason=req.body.reasonValue
        const id=req.body.id

        // console.log("ooooooooorddddddderuid",id)
        const findOrder=await Order.findByIdAndUpdate({_id:id},
            {
                $set:{
                    status:"Return proccess"
                }
            })




        

        res.json({status:true})




    } catch (error) {
      console.log(error.message)  
    }
 }

 const cancelReturn=async(req,res)=>{
    try {
        const id=req.body.id

        const findOrder=await Order.findById({_id:id})

        const updateOrder=await Order.findByIdAndUpdate({_id:id},{
            $set:{
                status:"Delivered"
            }
        })

a

    } catch (error) {
        console.log(error.message)
    }
 }

 const orderSuccess=async(req,res)=>{
    try {
        res.render("orderSuccess")
    } catch (error) {
        console.log(error.message)
    }
 }

 const rezopayment=async(req,res)=>{
    try {

        
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",req.body.order)
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",req.body.payment)
        // console.log("accccccccccccccccccccccccccccccccccccccccc",req.body.addressId)
        // console.log("aadddddddddddddddddddddddddddddddddddddddddaa",req.body.orderNum)

        // const{payment,order,addressId,orderNum}=req.body
        // const userData = await User.findOne({ email: req.session.email });
        // const cartData = await Cart.findOne({ userId: userData._id });
  
        // const proData = [];
        // for (let i = 0; i < cartData.items.length; i++) {
        //   proData.push(cartData.items[i]);
        // }
        // console.log(proData);
        // const quantity=[]
        
        // for(let i=0;i<proData.length;i++){
        //   quantity.push(proData[i].quantity)
        // }
    
        // const proId=[]
        
        // for(let i=0;i<proData.length;i++){
        //   proId.push(proData[i].productsId)
        // }
    
        // for(let i=0;i<proId.length;i++){
    
        //   const product=await Product.findByIdAndUpdate({_id:proId[i]},
        //     {
        //       $inc:{
        //         stock:-quantity[i]
        //       }
        //     })
        // }
        // // const orderNum = generateOrder.generateOrder();
        // const addressData = await Address.findOne({ _id: addressId });
        // const date=generateDate()
        // const orderData = new Order({
        //     userId: userData._id,
        //     userEmail:userData.email,
        //     orderNumber: orderNum,
        //     items: proData,
        //     totalAmount: cartData.total,
        //     orderType: "Razorpay",
        //     orderDate:date,
        //     status: "Processing",
        //     shippingAddress: addressData,
        //   });

        //   orderData.save()




        // res.json({status:true})

        // const deleteCart = await Cart.findByIdAndDelete({ _id: cartData._id });




        // console.log("rezorPaymenttttttttttttttttttttttt"+req.body)
    } catch (error) {
        console.log(error.message)
    }
 }


module.exports={
    loadViewOrder,
    cancelOrder,
    loadOrder,
    loadOrderDetail,
    saveOrder,
    returnRequest,
    cancelReturn,
    orderSuccess,
    rezopayment
}
