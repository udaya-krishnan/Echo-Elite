const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const Order = require("../model/orderModel");
const Wallet = require("../model/walletModel");
const generateOrder = require("../controller/otpGenrate");
const Coupon=require("../model/CouponModel")
const Razorpay = require("razorpay");
const generateTransaction=require("../controller/transationId")
const key_id = process.env.RAZORPAYID;

const key_secret = process.env.RAZORPAYSECRET;

var instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

const crypto = require("crypto");

const generateDate = require("../controller/dateGenrator");

const loadViewOrder = async (req, res) => {
  try {
    const id = req.query.id;
    const findOrder = await Order.findById({ _id: id });
    console.log(findOrder);

    const proId = [];

    for (let i = 0; i < findOrder.items.length; i++) {
      proId.push(findOrder.items[i].productsId);
    }

    const proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    



    res.render("orderView", { proData, findOrder });
  } catch (error) {
    console.log(error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const id = req.body.id; 
    console.log(id)

    const findOrder = await Order.findById({ _id: id });
    const userData=await User.findOne({email:req.session.email})
    console.log(findOrder)
    console.log("inside cancelOrder")

    if (findOrder.orderType == "Cash on Delivery") {
      const couponId=findOrder.coupon
      console.log(couponId+"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
      console.log("inside Cash on delivary");
      const updateOrder = await Order.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "Canceled",
          },
          $unset:{
            coupon:couponId
          }
        }
      );

      const proId = [];

      for (let i = 0; i < findOrder.items.length; i++) {
        proId.push(findOrder.items[i].productsId);
      }

      for (let i = 0; i < proId.length; i++) {
        await Product.findByIdAndUpdate(
          { _id: proId[i] },
          {
            $inc: {
              stock: findOrder.items[i].quantity,
            },
          }
        );
      }

      const findCoupon=await Coupon.findByIdAndUpdate({_id:couponId},
        {
          $pull:{users:{$eq:userData._id}}
        })

        console.log(findCoupon+"wwwwwwwwwwwwwwwwwwwwwwwwwwww")

      
    } else if(findOrder.orderType == "Razorpay") {
       console.log("inside Razorpay")
      const findUser = await User.findOne({ email: req.session.email });
      const findOrder=await Order.findById({_id:id})
      const date = generateDate();
      const Tid= generateTransaction()

      const updateOrder = await Order.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "Canceled",
          },
        }
      );

      const proId = [];

      for (let i = 0; i < findOrder.items.length; i++) {
        proId.push(findOrder.items[i].productsId);
      }

      for (let i = 0; i < proId.length; i++) {
        await Product.findByIdAndUpdate(
          { _id: proId[i] },
          {
            $inc: {
              stock: findOrder.items[i].quantity,
            },
          }
        );
      }

        const userInWallet= await Wallet.findOne({userId:findUser._id})

        console.log(userInWallet)
 
        if(userInWallet){
          console.log("inside userWallet")
          const updateWallet=await Wallet.findOneAndUpdate({userId:findUser._id},
            {
              $inc:{
                balance:findOrder.totalAmount
              },
              $push:{
                transactions:{
                  id:Tid,
                  date:date,
                  amount:findOrder.totalAmount
                }
              }
            })
        }else{
          console.log("else worked");
          const createWallet=new Wallet({
            userId:findUser._id,
            balance:findOrder.totalAmount,
            transactions:[{
              id:Tid,
              date:date,
              amount:findOrder.totalAmount,
            }]
          })

          await createWallet.save()
        }
    }

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

//*************************************************ADMIN SIDE********************** */

const loadOrder = async (req, res) => {
  try {
    const orderData = await Order.find({}).sort({ _id: -1 });

    res.render("adminOrder", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const loadOrderDetail = async (req, res) => {
  try {
    const id = req.query.id;
    const findOrder = await Order.findById({ _id: id });

    let proId = [];
    for (let i = 0; i < findOrder.items.length; i++) {
      proId.push(findOrder.items[i].productsId);
    }

    let proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    res.render("detailOrder", { findOrder, proData });
  } catch (error) {
    console.log(error.message);
  }
};

const saveOrder = async (req, res) => {
  try {
    const { status, id } = req.body;

    console.log(id, status);

    const checking = await Order.findById({ _id: id });

    if (checking.status == status) {
      res.json({ status: "notChanged" });
    } else {
      const updateStatus = await Order.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: status,
          },
        }
      );
    }
    if (status == "Returned") {
      const proId = [];

      for (let i = 0; i < checking.items.length; i++) {
        proId.push(checking.items[i].productsId);
      }

      for (let i = 0; i < proId.length; i++) {
        await Product.findByIdAndUpdate(
          { _id: proId[i] },
          {
            $inc: {
              stock: checking.items[i].quantity,
            },
          }
        );
      }
    } else if (status == "Canceled") { 
      // const findUser = await User.findOne({ email: req.session.email });
      const findOrder=await Order.findById({_id:id})
      if(findOrder.orderType=="Cash on Delivery"){

        const updateOrder = await Order.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              status: "Canceled",
            },
          }
        );
  
        const proId = [];
  
        for (let i = 0; i < findOrder.items.length; i++) {
          proId.push(findOrder.items[i].productsId);
        }
  
        for (let i = 0; i < proId.length; i++) {
          await Product.findByIdAndUpdate(
            { _id: proId[i] },
            {
              $inc: {
                stock: findOrder.items[i].quantity,
              },
            }
          );
        }

      }else if(findOrder.orderType == "Razorpay"){

        // const findUser = await User.findOne({ email: req.session.email });
        const findOrder=await Order.findById({_id:id})
        const date = generateDate();
        const Tid= generateTransaction()
  
        const updateOrder = await Order.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              status: "Canceled",
            },
          }
        );
  
        const proId = [];
  
        for (let i = 0; i < findOrder.items.length; i++) {
          proId.push(findOrder.items[i].productsId);
        }
  
        for (let i = 0; i < proId.length; i++) {
          await Product.findByIdAndUpdate(
            { _id: proId[i] },
            {
              $inc: {
                stock: findOrder.items[i].quantity,
              },
            }
          );
        }
  
          const userInWallet= await Wallet.findOne({userId:findOrder.userId})
  
          // console.log(userInWallet)
   
          if(userInWallet){
            console.log("inside userWallet")
            const updateWallet=await Wallet.findOneAndUpdate({userId:findOrder.userId},
              {
                $inc:{
                  balance:findOrder.totalAmount
                },
                $push:{
                  transactions:{
                    id:Tid,
                    date:date,
                    amount:findOrder.totalAmount
                  }
                }
              })
          }else{
            console.log("else worked");
            const createWallet=new Wallet({
              userId:findOrder.userId,
              balance:findOrder.totalAmount,
              transactions:[{
                id:Tid,
                date:date,
                amount:findOrder.totalAmount,
              }]
            })
  
            await createWallet.save()
          }

      }
    //   const updateOrder = await Order.findByIdAndUpdate(
    //     { _id: id },
    //     {
    //       $set: {
    //         status: "Canceled",
    //       },
    //     }
    //   );

    //   const proId = [];

    //   for (let i = 0; i < checking.items.length; i++) {
    //     proId.push(checking.items[i].productsId);
    //   }

    //   for (let i = 0; i < proId.length; i++) {
    //     await Product.findByIdAndUpdate(
    //       { _id: proId[i] },
    //       {
    //         $inc: {
    //           stock: checking.items[i].quantity,
    //         },
    //       }
    //     );
    //   }
    }

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const returnRequest = async (req, res) => {
  try {
    const reason = req.body.reasonValue;
    const id = req.body.id;

    // console.log("ooooooooorddddddderuid",id)
    const findOrder = await Order.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          status: "Return proccess",
        },
      }
    );

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const cancelReturn = async (req, res) => {
  try {
    const id = req.body.id;

    const findOrder = await Order.findById({ _id: id });

    const updateOrder = await Order.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          status: "Delivered",
        },
      }
    );

   
  } catch (error) {
    console.log(error.message);
  }
};

const orderSuccess = async (req, res) => {
  try {
    res.render("orderSuccess");
  } catch (error) {
    console.log(error.message);
  }
};

const rezopayment = async (req, res) => {
  try {

    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", req.body.order);
    // console.log(
    //   "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    //   req.body.payment
    // );

    const { payment, order, addressId, order_id ,amount,couponCode} = req.body;
    const findCoupon=await Coupon.findOne({couponCode:couponCode})

    console.log("start")
    console.log( amount)
    console.log("end")



    let hmac = crypto.createHmac("sha256", key_secret);

    hmac.update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == payment.razorpay_signature) {
    
      const userData = await User.findOne({ email: req.session.email });
      const cartData = await Cart.findOne({ userId: userData._id });

      const proData = [];
      for (let i = 0; i < cartData.items.length; i++) {
        proData.push(cartData.items[i]);
      }
      console.log(proData);
      const quantity = [];

      for (let i = 0; i < proData.length; i++) {
        quantity.push(proData[i].quantity);
      }

      const proId = [];

      for (let i = 0; i < proData.length; i++) {
        proId.push(proData[i].productsId);
      }

      for (let i = 0; i < proId.length; i++) {
        const product = await Product.findByIdAndUpdate(
          { _id: proId[i] },
          {
            $inc: {
              stock: -quantity[i],
            },
          }
        );
      }
      // const orderNum = generateOrder.generateOrder();
     

      if(findCoupon){

        const addressData = await Address.findOne({ _id: addressId });
        const date = generateDate();
        const orderData = new Order({
          userId: userData._id,
          userEmail: userData.email,
          orderNumber: order_id,
          items: proData,
          totalAmount: amount,
          orderType: "Razorpay",
          orderDate: date,
          status: "Processing",
          shippingAddress: addressData,
          coupon:findCoupon.couponCode,
          discount:findCoupon.discount
        });
  
        orderData.save();
        
        const updateCoupon=await Coupon.findByIdAndUpdate({_id:findCoupon._id},
          {
            $push:{
              users:userData._id
            }
          })
      }else{
        const addressData = await Address.findOne({ _id: addressId });
        const date = generateDate();
        const orderData = new Order({
          userId: userData._id,
          userEmail: userData.email,
          orderNumber: order_id,
          items: proData,
          totalAmount: amount,
          orderType: "Razorpay",
          orderDate: date,
          status: "Processing",
          shippingAddress: addressData,
        });
  
        orderData.save();
      }

      // const userInWallet = await Wallet.findOne({ userId: userData._id });

      // if (userInWallet) {
      //   const wallet = await Wallet.findOneAndUpdate(
      //     { userId: userData._id },
      //     {
      //       $push: {
      //         transactions: {
      //           date: date,
      //           amount: cartData.total,
      //           orderType: "Razorpay",
      //         },
      //       },
      //     }
      //   );
      // } else {
      //   const wallet = new Wallet({
      //     userId: userData._id,
      //     transactions: [
      //       {
      //         date: date,
      //         amount: cartData.total,
      //         orderType: "Razorpay",
      //       },
      //     ],
      //   });

      //   await wallet.save();
      // }

      res.json({ status: true });

      const deleteCart = await Cart.findByIdAndDelete({ _id: cartData._id });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// const loadWallet=async(req,res)=>{
//   try {
//     res.render("wallet")
//   } catch (error) {
//     console.log(error.mesage)
//   }
// }

const addWalletCash = async (req, res) => {
  try {
    const amount = req.body.Amount;
    const orderId = generateOrder.generateOrder();

    var options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "" + orderId,
    };

    instance.orders.create(options, async (err, razopayWallet) => {
      if (!err) {
        console.log("lllllllllllllllllllllll ", razopayWallet);
        res.json({ status: true, wallet: razopayWallet, Amount: amount });
      } else {
        console.log(err.message);
      }
    });

    // console.log(amount)
  } catch (error) {
    console.log(error.message);
  }
};

const addCash = async (req, res) => {
  try {
    const { wallet, id, amount } = req.body;

    console.log(wallet);
    console.log(id);

    let hmac = crypto.createHmac("sha256", key_secret);

    hmac.update(wallet.razorpay_order_id + "|" + wallet.razorpay_payment_id);
    hmac = hmac.digest("hex");
    if (hmac == wallet.razorpay_signature) {
      const id= generateTransaction()
      const date = generateDate();
      const userData = await User.findOne({ email: req.session.email });
      const userInWallet = await Wallet.findOne({ userId: userData._id });
      if (userInWallet) {
        
        const updateWallet = await Wallet.findByIdAndUpdate(
          { _id: userInWallet._id },
          {
            $inc: {
              balance:amount,
            },
            $push:{
              transactions:{
                id:id,
                date:date,
                amount:amount
              },
            }
          }
        );
      }else{
        
        const newWallet=new Wallet({
          userId:userData._id,
          balance:amount,
          transactions:[
            {
              id:id,
              amount:amount,
              date:date
            }
          ]
        })

       await newWallet.save()
      }
    }

    res.json({status:true})
  } catch (error) {
    console.log(error.message);
  }
};

const paymentFaild=async(req,res)=>{
  try {
    console.log("payment faild");
    const {address,amount,couponCode}=req.body
    console.log(address,amount);
    console.log("codddddddddde"+couponCode);
    const userData=await User.findOne({email:req.session.email})
    const cartData=await Cart.findOne({userId:userData._id})
    const date = generateDate();
    const orderNum = generateOrder.generateOrder();
    const addressData=await Address.findById({_id:address})

    const proData=[]

    for(let i=0;i<cartData.items.length;i++){
      proData.push(cartData.items[i])
    }

    const orderData=new Order({
      userId:userData._id,
      userEmail:userData.email,
      orderNumber:orderNum,
      items:proData,
      totalAmount:amount,
      orderType:"Razorpay",
      orderDate:date,
      status:"Payment Failed",
      shippingAddress:addressData
    })

    orderData.save();




  } catch (error) {
    console.log(error.message)
  }
}


const continuePayment=async(req,res)=>{
  try {
    console.log("continue payment");
    const id=req.body.id

    const findOrder=await Order.findById({_id:id})
    const proData=[]
    for(let i=0;i<findOrder.items.length;i++){
        proData.push(findOrder.items[i])
    }
    const quantity=[]

    for(let i=0;i<findOrder.items.length;i++){
      quantity.push(findOrder.items[i].quantity)
    }
    // console.log(proData)
    const products=[]
    for(let i=0;i<proData.length;i++){
      products.push(await Product.findById({_id:proData[i].productsId}))
    }


    for(let i=0;i<products.length;i++){
      console.log("checked");
      if(products[i].stock!=quantity[i]){
        res.json({status:"checked"})
      }
    }

    const stringOrder_id=findOrder.orderNumber.toString()

    var options={
      amount:findOrder.totalAmount*100,
      currency:"INR",
      receipt:stringOrder_id
    }

    console.log(options)

    instance.orders.create(options,async(error,razorpayOrder)=>{
      console.log("inside the order")
      console.log(razorpayOrder);
      if(!error){
        console.log("with out the ERROR");
      

        res.json({status:true,order:razorpayOrder,orderId:findOrder._id})
      

      }else{
        console.log("full error");
        console.error(error);
      }
    })


  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
  loadViewOrder,
  cancelOrder,
  loadOrder,
  loadOrderDetail,
  saveOrder,
  returnRequest,
  cancelReturn,
  orderSuccess,
  rezopayment,
  addWalletCash,
  addCash,
  paymentFaild,
  continuePayment
};
