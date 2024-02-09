const express=require("express")

const user_router=express()

user_router.set('view engine','ejs')
user_router.set('views','./views/user')

const userController=require("../controller/userController")

const userAuth=require("../middleware/auth")
 user_router.get('/404',userController.PNF)
user_router.get('/',userController.loadLanding)
user_router.get('/registration',userAuth.isLogOut,userController.loadRegister)
user_router.post('/registrationPost',userAuth.isLogOut,userController.insertUser)
user_router.get('/otp',userAuth.isLogOut,userController.loadOtp)
user_router.post('/otpPost',userAuth.isLogOut,userController.getOtp)
user_router.get('/login',userAuth.isLogOut,userController.loadLogin)
user_router.post('/loginPost',userAuth.isLogOut,userController.verifylogin)
user_router.get('/forgot',userAuth.isLogOut,userController.loadForgot)
user_router.post('/forgotPost',userAuth.isLogOut,userController.forgot)
user_router.get('/forgotOtp',userAuth.isLogOut,userController.loadForgotOTP)
user_router.get('/logout',userAuth.islogin,userController.logout)
user_router.get('/home',userAuth.islogin,userController.loadHome)
user_router.get('/dashboard',userAuth.islogin,userController.loadDash)


user_router.get('/showproduct',userAuth.islogin,userController.loadProduct)
  

// admin_route.get("*",function(req,res){

//     res.redirect('/admin')
// })


user_router.get("*",(req,res)=>{
    res.redirect("/404")
})



module.exports=user_router; 