const Wishlist=require("../model/wishlistModel")
const Cart=require("../model/cartModel")
const User=require("../model/userModel")

const count=async(req,res,next)=>{
    try {
        if(req.session.email){
            const findUser=await User.findOne({email:req.session.email})

            const cart=await Cart.findOne({userId:findUser._id})
           
            if(cart){
                req.session.cart=cart.items.length
            }else{
                req.session.cart=0
            }
            const wishlist=await Wishlist.findOne({user_id:findUser._id})

            if(wishlist){
                req.session.wish=wishlist.products.length
            }else{
                req.session.wish=0
            }

            next()
        }else{
            req.session.cart=0
            req.session.wish=0
            next()
        }
        
    } catch (error) {
      console.log(error.message)  
    }
}

module.exports=count