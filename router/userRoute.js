const express=require("express")

const user_router=express()

user_router.set('view engine','ejs')
user_router.set('views','./views/user')

const userController=require("../controller/userController")
const cartController=require("../controller/cartController")
const orderController=require("../controller/orderController")
const shopController=require("../controller/shopController")
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
user_router.get('/home',userAuth.isBlocked,userAuth.islogin,userController.loadHome)



//**************************************product********************** */

user_router.get('/showproduct',userController.loadProduct)


//"""""""""""""""""""""""""""""""""""""""''UserProfile"""""""""""""""""""""""""""""""""""//


user_router.get('/dashboard',userAuth.isBlocked,userAuth.islogin,userController.loadDash)

user_router.get("/addAddress",userAuth.isBlocked,userAuth.islogin,userController.loadAddaddress)
user_router.post("/addAddress",userAuth.isBlocked,userAuth.islogin,userController.addAddress)


user_router.get("/resendOtp",userController.resendOtp)


user_router.get('/address-dele',userAuth.isBlocked,userAuth.islogin,userController.deletAddress)

user_router.get("/address-edit",userAuth.isBlocked,userAuth.islogin,userController.loadEditAddress)
user_router.post("/address-edit",userAuth.isBlocked,userAuth.islogin,userController.editAddress)

user_router.get('/orders',userAuth.isBlocked,userAuth.islogin,userController.loadOrder)
user_router.get('/wallet',userAuth.isBlocked,userAuth.islogin,userController.loadTrack)
user_router.get('/address',userAuth.isBlocked,userAuth.islogin,userController.loadAddress)
user_router.get('/change-pass',userAuth.isBlocked,userAuth.islogin,userController.loadChangePass) 
user_router.get('/account-detail',userAuth.isBlocked,userAuth.islogin,userController.loadAccount) 

user_router.post("/change-pass",userAuth.isBlocked,userAuth.islogin ,userController.changePass)


user_router.get("/account-edit",userAuth.isBlocked,userAuth.islogin,userController.loadEditAccount)

user_router.post("/account-edit",userController.editAccount) 



//*******************************************************CART***************************88 */


  user_router.post("/addCatLoad",cartController.loadCart)

  user_router.get("/cart",userAuth.isBlocked,userAuth.islogin,cartController.loadCartpage)

  user_router.post("/cartadd",userAuth.isBlocked,userAuth.islogin,cartController.addCart)

  user_router.post("/decrement",userAuth.islogin,userAuth.isBlocked,cartController.decrement)

  user_router.post("/pro-del",userAuth.islogin,userAuth.isBlocked,cartController.removeCart)



  //*******************************************shop************************************ */


  user_router.get("/shop",userController.loadShop)
  // user_router.get("/lowTohigh",shopController.loadWithlowtoHigh)
  // user_router.get("/highTolow",shopController.highTolow)
  // user_router.get("/aAzZ",shopController.AtoZ)
  // user_router.get("/zZaA",shopController.ZtoA)
  user_router.post("/next-page",shopController.nextPage)

  user_router.get("/filter",shopController.categoryfilter)
  user_router.get("/brandFiter",shopController.brandFilter)



  //***************************************************Ckeck Out************************ */


  user_router.get("/checkOut",userAuth.islogin,userAuth.isBlocked,cartController.loadCheckOut)

  user_router.get("/checkOutPage",userAuth.isBlocked,userAuth.islogin,cartController.loadCheckOutPage)

  user_router.post("/checkOutData",userAuth.isBlocked,userAuth.islogin,cartController.addOrder)

  user_router.get("/orderSuccess",userAuth.isBlocked,userAuth.islogin,orderController.orderSuccess)

  user_router.post("/verify-payment",userAuth.isBlocked,userAuth.islogin,orderController.rezopayment)



  //***********************************************Order**************************** */


  user_router.get("/orderView",userAuth.isBlocked,userAuth.islogin,orderController.loadViewOrder)

  user_router.post("/cancelOrder",userAuth.isBlocked,userAuth.islogin,orderController.cancelOrder)

  user_router.post("/cancelReturn",userAuth.isBlocked,userAuth.islogin,orderController.cancelReturn)

  user_router.post("/return",userAuth.isBlocked,userAuth.islogin,orderController.returnRequest)


  //****************************************Wishlist*************88 */


  user_router.get('/wishlist',shopController.loadWishlist)
  user_router.post("/addWishlist",shopController.addWishlist)
  user_router.post("/removeWish",shopController.removeWish)
  user_router.post("/remove-Wishlist",shopController.removeFromwishlist)



  //**************************************************************Wallet*************88 */


  user_router.post("/addCash",userAuth.isBlocked,userAuth.islogin,orderController.addWalletCash)

  user_router.post("/addAmount",userAuth.isBlocked,userAuth.islogin,orderController.addCash)

 





module.exports=user_router; 