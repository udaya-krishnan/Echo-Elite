 const couponCode=require("../controller/couponCode")
 const Coupon=require("../model/CouponModel")
 const date=require("../controller/dateGenrator")

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

                res.json({status:false})
                
        }else{
            const updateCoupon=await Coupon.findByIdAndUpdate({_id:id},
                {
                    $set:{
                        isActive:true
                    }
                })  

                res.json({status:true})
        }


    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadCouponPage,
    addCouponLoad,
    addCoupon,
    blockCoupon
}