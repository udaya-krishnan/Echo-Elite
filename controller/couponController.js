 const couponCode=require("../controller/couponCode")
 const Coupon=require("../model/CouponModel")
 const date=require("../controller/dateGenrator")
 const Cart=require("../model/cartModel")
 const User=require("../model/userModel")

const loadCouponPage=async(req,res)=>{
    try {
        const couponData=await Coupon.find({})
        res.render("adminCoupon",{couponData})
    } catch (error) {
     console.log(error.message)   
    }
}

const addCouponLoad=async(req,res)=>{
    try {
        res.render("addCoupon")
    } catch (error) {
        console.log(error.message)
    }
}


const addCoupon=async(req,res)=>{
    try {
        const{Minimum,startDate,nameValue,endDate,maximum,discount}=req.body
        
        

            const addCoupon=new Coupon({
                name:nameValue,
                startDate:startDate,
                EndDate:endDate,
                minimumAmount:Minimum,
                maximumAmount:maximum,
                discount:discount,
                couponCode:"Echo"+couponCode(6)
            })
            await addCoupon.save()

        

     
        res.json({status:true})
    } catch (error) {
        console.log(error.message)
    }
}

const blockCoupon=async(req,res)=>{
    try {
        const id=req.body.id
        const findCoupon = await Coupon.findById({_id:id})
        // console.log("inside block coupon")
        if(findCoupon.isActive===true){
            const updateCoupon = await Coupon.findByIdAndUpdate({_id:id},
                {
                    $set:{
                        isActive:false
                    }
                })

                res.json({status:true})
                
        }else{
            const updateCoupon=await Coupon.findByIdAndUpdate({_id:id},
                {
                    $set:{
                        isActive:true
                    }
                })  

                res.json({status:false})
        }


    } catch (error) {
        console.log(error.message)
    }
}


const applyCoupon=async(req,res)=>{
    try {
        console.log("inside the applay")
        const {code,id}=req.body
        console.log(code)
        const findCart=await Cart.findOne({_id:id})
        console.log(findCart)
        
        const findCode=await Coupon.findOne({couponCode:code})
        console.log(findCode) 
        const findUser=await User.findOne({email:req.session.email})
        console.log(findUser)
    
        if(findCode){
            if(findCart.total>=findCode.minimumAmount&&findCart.total<=findCode.maximumAmount){
                console.log("succccccccccccccccccces")
                const userIncoupon=await Coupon.findOne({_id:findCode._id,users:findUser._id})
                console.log(userIncoupon)
                // let result=false
                // for(let i=0;i<findCode.users.length;i++){
                //     const userIncoupon=await Coupon.findById({_id:findCode._id,"users"})
                // }
               
                // console.log(userIncoupon)
                // console.log("heloo fuck")
                if(userIncoupon){
                    res.json({status:"invalid"})
                }else{
                    const amount= findCart.total/findCode.discount
                    console.log(amount);
                    // const updateCart=await Cart.findByIdAndUpdate({_id:findCart._id},{
                    //     $inc:{
                    //         total:-amount
                    //     }
                    // })

                    res.json({status:true,total:amount,cartTotal:findCart.total,code:code})
                }
            }else{
                console.log("iiiiiiiiiiiiiinnvalid")
                res.json({status:"invaild"})
            }
           
        }else{
            console.log("invalide")
            res.json({status:"invaild"})
        }

        // if(findCode){
        //     const findCart=await Cart.findById({_id:id})
        //      const amount=findCart.total/findCode.discount
        //     console.log("hello",amount)
        //      const updateCart=await Cart.findByIdAndUpdate({_id:id},
        //         {
        //             $inc:{
        //                 total:-amount
        //             }
        //         })
                

        //         res.json({status:true})


        // }else{
        //     res.json({status:false})

        // }
        
    } catch (error) {
        console.log(error.message)
    }
}

const editpageLoad=async(req,res)=>{
    try {
        const id=req.query.id
        const findCoupon=await Coupon.findById({_id:id})
        console.log(id)
        res.render("editCoupon",{findCoupon})
    } catch (error) {
        console.log(error.messagge)
    }
}

const editCoupon=async(req,res)=>{
    try {
        const{Minimum,startDate,nameValue,endDate,maximum,discount}=req.body
        // console.log(Minimum,startDate,nameValue,endDate,maximum,discount)
          const id=req.body.id
        //   console.log(id)
        const couponData= await Coupon.findOneAndUpdate({_id:id},{
            $set:{
                name:nameValue,
                startDate:startDate,
                EndDate:endDate,
                minimumAmount:Minimum,
                maximumAmount:maximum,
                discount:discount,
            }
        })
    
       res.json({status:true})
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadCouponPage,
    addCouponLoad,
    addCoupon,
    blockCoupon,
    applyCoupon,
    editpageLoad,
    editCoupon
}