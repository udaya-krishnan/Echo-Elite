const express=require("express")

const user_router=express()

user_router.set('view engine','ejs')
user_router.set('views','./views/user')

const userController=require("../controller/userController")
const cartController=require("../controller/cartController")
const orderController=require("../controller/orderController")
const shopController=require("../controller/shopController")
const couponController=require("../controller/couponController")
const productController=require("../controller/productController")
const userAuth=require("../middleware/auth")



user_router.get('/404',userController.PNF)
user_router.get('/',userController.loadLanding)
.get('/registration',userAuth.isLogOut,userController.loadRegister)
.post('/registrationPost',userAuth.isLogOut,userController.insertUser)
.get('/otp',userAuth.isLogOut,userController.loadOtp)
.post('/otpPost',userAuth.isLogOut,userController.getOtp)
.get('/login',userAuth.isLogOut,userController.loadLogin)
.post('/loginPost',userAuth.isLogOut,userController.verifylogin)
.get('/forgot',userAuth.isLogOut,userController.loadForgot)
.post('/forgotPost',userAuth.isLogOut,userController.forgot) 
.get('/forgotOtp',userAuth.isLogOut,userController.loadForgotOTP)
.get('/logout',userAuth.islogin,userController.logout)
.get('/home',userAuth.isBlocked,userAuth.islogin,userController.loadHome)



//**************************************product********************** */

.get('/showproduct',userController.loadProduct)


//"""""""""""""""""""""""""""""""""""""""''UserProfile"""""""""""""""""""""""""""""""""""//


.get('/dashboard',userAuth.isBlocked,userAuth.islogin,userController.loadDash)

.get("/addAddress",userAuth.isBlocked,userAuth.islogin,userController.loadAddaddress)
.post("/addAddress",userAuth.isBlocked,userAuth.islogin,userController.addAddress)


.get("/resendOtp",userController.resendOtp)


.get('/address-dele',userAuth.isBlocked,userAuth.islogin,userController.deletAddress)

.get("/address-edit",userAuth.isBlocked,userAuth.islogin,userController.loadEditAddress)
.post("/address-edit",userAuth.isBlocked,userAuth.islogin,userController.editAddress)

.get('/orders',userAuth.isBlocked,userAuth.islogin,userController.loadOrder)
.get('/wallet',userAuth.isBlocked,userAuth.islogin,userController.loadTrack)
.get('/address',userAuth.isBlocked,userAuth.islogin,userController.loadAddress)
.get('/change-pass',userAuth.isBlocked,userAuth.islogin,userController.loadChangePass) 
.get('/account-detail',userAuth.isBlocked,userAuth.islogin,userController.loadAccount) 

.post("/change-pass",userAuth.isBlocked,userAuth.islogin ,userController.changePass)


.get("/account-edit",userAuth.isBlocked,userAuth.islogin,userController.loadEditAccount)

.post("/account-edit",userController.editAccount) 



//*******************************************************CART***************************88 */


 .post("/addCatLoad",cartController.loadCart)

  .get("/cart",userAuth.isBlocked,userAuth.islogin,cartController.loadCartpage)

 .post("/cartadd",userAuth.isBlocked,userAuth.islogin,cartController.addCart)

  .post("/decrement",userAuth.islogin,userAuth.isBlocked,cartController.decrement)

 .post("/pro-del",userAuth.islogin,userAuth.isBlocked,cartController.removeCart)



  //*******************************************shop************************************ */


.get("/shop",userController.loadShop)
 
  .post("/next-page",shopController.nextPage)

  .get("/catagory",shopController.categoryfilter)
.get("/brandFiter",shopController.brandFilter)

.post("/shop-search",shopController.search)
.get("/previous-page",shopController.previousPage)

.post("/search",shopController.searchProducts)
  //***************************************************Ckeck Out************************ */


 .get("/checkOut",userAuth.islogin,userAuth.isBlocked,cartController.loadCheckOut)

  .get("/checkOutPage",userAuth.isBlocked,userAuth.islogin,cartController.loadCheckOutPage)

  .post("/checkOutData",userAuth.isBlocked,userAuth.islogin,cartController.addOrder)

  .get("/orderSuccess",userAuth.isBlocked,userAuth.islogin,orderController.orderSuccess)

  .post("/verify-payment",userAuth.isBlocked,userAuth.islogin,orderController.rezopayment)

  .post("/paymentFaild",userAuth.isBlocked,userAuth.islogin,orderController.paymentFaild)

  .post("/continue-Payment",userAuth.isBlocked,userAuth.islogin,orderController.continuePayment)
  .post("/payment-sucess",userAuth.isBlocked,userAuth.islogin,orderController.successPayment)



  //***********************************************Order**************************** */


 .get("/orderView",userAuth.isBlocked,userAuth.islogin,orderController.loadViewOrder)

 .post("/cancelOrder",userAuth.isBlocked,userAuth.islogin,orderController.cancelOrder)

  .post("/cancelReturn",userAuth.isBlocked,userAuth.islogin,orderController.cancelReturn)

.post("/return",userAuth.isBlocked,userAuth.islogin,orderController.returnRequest)


  //****************************************Wishlist*************88 */


  .get('/wishlist',shopController.loadWishlist)
.post("/addWishlist",shopController.addWishlist)
.post("/removeWish",shopController.removeWish)
 .post("/remove-Wishlist",shopController.removeFromwishlist)



  //**************************************************************Wallet*************88 */


.post("/addCash",userAuth.isBlocked,userAuth.islogin,orderController.addWalletCash)

  .post("/addAmount",userAuth.isBlocked,userAuth.islogin,orderController.addCash)

 

.get("/coupon",userAuth.isBlocked,userAuth.islogin,userController.loadCoupon)

.post("/applyCoupon",userAuth.islogin,userAuth.isBlocked,couponController.applyCoupon)


//*********************************************Rating************************ */

.post("/rating",userAuth.islogin,userAuth.isBlocked,productController.ratingProduct)

.get("/loadInvoice",userAuth.isBlocked,userAuth.islogin,userController.loadInvoice)





module.exports=user_router; 