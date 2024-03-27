const User = require("../model/userModel");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generateOTP = require("../controller/otpGenrate");
const Wishlist = require("../model/wishlistModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");
const Adderss = require("../model/addressModel");
const Cart = require("../model/cartModel");
const Wallet = require("../model/walletModel");
const Order = require("../model/orderModel");
const Coupon = require("../model/CouponModel");
const CouponModel = require("../model/CouponModel");
const referralCode = require("../controller/refferalCode");
const generateDate = require("../controller/dateGenrator");
const generateTransaction=require("../controller/transationId")
const Rating=require("../model/ratingModel")

const Email = process.env.Email;
const pass = process.env.Pass;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: Email,
    pass: pass,
  },
});

//***************** */ password hashing*********************************
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

//************************************load home page*******************/

const loadLanding = async (req, res) => {
  try {
    const catData = await Category.find({});

    const proData = await Product.find({ stock: { $gt: 0 } });

    const brandData = await Brand.find({});

    const newArrivals = await Product.find({}).sort({ _id: -1 }).limit(6); 

    res.render("landing", { catData, proData, brandData, newArrivals });
  } catch (error) {
    console.log(error.message);
  }
};

/****************************************LOAD REGISTER PAGE*******************/
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error);
  }
};

/***********************************INSERT USER  || SEND THE OTP  ****************************/

const insertUser = async (req, res) => {
  try {
    // console.log("inssssssssssssssssssssssss");
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mob;
    const password = req.body.pass;
    const confirm = req.body.confirm;
    const reffer = req.body.reffer;
    console.log("reffer"+reffer)

    // console.log(email);
    // console.log(mobile);

    // res.redirect('/otp')
    const otp = generateOTP.generateOTP();
    console.log(otp);
    //     // console.log(otp);
    //      const {name,email,mobile,password,confirm}=req.body
    const existsEmail = await User.findOne({ email: email });
    const existsMobile = await User.findOne({ mobile: mobile });

    console.log("inside insert d   ddddddddd");

    if (existsEmail) {
      res.json({ status: "emailErr" });
    } else if (existsMobile) {
      res.json({ status: "mobilErr" });
    } else {
      if (reffer != "") {
        console.log("inside reffer")
        const searchReffer = await User.findOne({ referralCode: reffer });
        console.log(searchReffer)
        if (searchReffer) {
          console.log("inside search reff")
          const data = {
            name,
            email,
            mobile,
            password,
            confirm,
            reffer,
            otp,
          };
          res.json({ status: true });
          req.session.Data = data;
          req.session.save();
        } else {
          res.json({status:"reffer"})
        }
          
      }else{
        console.log("hello")
        res.json({ status: true });
          const data = {
            name,
            email,
            mobile,
            password,
            confirm,
            otp,
          };
          req.session.Data = data;
          req.session.save();
        }
    }
    

      const mailOptions = await {
        form: Email,
        to: req.body.email,
        subject: "Your OTP for Verification",
         html: `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
            <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                <p style="font-size: 1.1em">Hi ${email},</p>
                <p>This message from ECHO ELITE. Use the following OTP to complete your register procedures. OTP is valid for 1 minutes</p>
                <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                <p style="font-size: 0.9em;">Regards,<br />ECHO EILTE</p>
                <hr style="border: none; border-top: 1px solid #eee" />
            </div>
        </div>`,
      };
      if (mailOptions) {
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log("mail send sucessfull");
          }
        });
      }
    
  } catch (error) {
    console.log(error);
  }
};

/***************************LOAD OTP PAGE************************************** */

const loadOtp = async (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    console.log(error.message);
  }
};

/********************************GET OTP*********************************/

const getOtp = async (req, res) => {
  try {
    //  console.log(req.session,'this is session data')
    //  console.log('hello')
    const date = generateDate();
    const Tid= generateTransaction()


    const gotOtp = req.body.otp;

    console.log(gotOtp);
    if (req.session.Data) {
      if (gotOtp == req.session.Data.otp) {
        const passwordHash = await securePassword(req.session.Data.password);
        if(passwordHash){
        const refferal=referralCode(8)
        console.log(refferal)
        const user = new User({
          name: req.session.Data.name,
          email: req.session.Data.email,
          mobile: req.session.Data.mobile,
          password: passwordHash,
          is_admin: 0,
          is_verified: 1,
          referralCode:refferal
        });
        const userData = await user.save();
      }
        if (req.session.Data.reffer) {
          const findUser=await User.findOne({referralCode:req.session.Data.reffer})
          const findUserWallet=await Wallet.findOne({userId:findUser._id})
          if(findUserWallet){
            const updateWallet=await Wallet.findOneAndUpdate({userId:findUser._id},
              {
                $inc:{
                  balance:100
                },
                $push:{
                  transactions:{
                    id:Tid,
                    date:date,
                    amount:100
                  }
                }
              })

              const newUser=await User.findOne({email:req.session.Data.email})
              const forNewWallet =new Wallet({
                userId:newUser._id,
                balance:100,
                transactions:[{
                  id:Tid,
                  date:date,
                  amount:100
                }]
              })
              await forNewWallet.save()

          }else{
            console.log("else worked");
            const createWallet=new Wallet({
              userId:findUser._id,
              balance:100,
              transactions:[{
                id:Tid,
                date:date,
                amount:100
              }]
            })

            await createWallet.save()
            const newUser=await User.findOne({email:req.session.Data.email})
            const forNewWallet =new Wallet({
              userId:newUser._id,
              balance:100,
              transactions:[{
                id:Tid,
                date:date,
                amount:100
              }]
            })
            await forNewWallet.save()
          }
          }

        res.json({ status: true });
      } else {
        res.json({ status: "wroung" });
      }
    }
    if (req.session.forgotData) {
      if (gotOtp == req.session.forgotData.otp) {
        // console.log(req.session.forgotData.email);
        const passwordHash = await securePassword(
          req.session.forgotData.newPass
        );
        const UserData = await User.updateOne(
          { email: req.session.forgotData.email },
          { password: passwordHash }
        );
        res.json({ status: true });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//******************************LOAD LOGIN *****************/

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      console.log("inside the null");
      if (userData.is_blocked == false) {
        req.session.email = email;
        console.log("verify");
        const passwordMatch = await bcrypt.compare(password, userData.password);
        console.log("passwordMatched");
        if (passwordMatch) {
          req.session.auth = true;
          req.session.userId = userData._id;

          // console.log(req.session.userId)
          // res.redirect('/home')
          res.json({ status: "home" });
        } else {
          // res.render('login')
          res.json({ status: "passErr" });
        }
      } else {
        res.json({ status: "blocked" });
      }
    } else {
      res.json({ status: "emailErr" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/*********************************************LOGOUT*************************** */

const logout = async (req, res) => {
  try {
    req.session.email = null;

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

/********************************************FORGOT LOADPAGE*********************** */

const loadForgot = async (req, res) => {
  try {
    res.render("forgotPass");
  } catch (error) {
    console.log(error.message);
  }
};

/********************************************FORGOT DATA************************** */

const forgot = async (req, res) => {
  try {
    // console.log("hellosjdhkhccccccccccccccccc");
    const email = req.body.email;
    const newPass = req.body.newPass;
    const confirm = req.body.confirm;
    const Data = await User.findOne({ email: email });
    if (Data) {
      if (newPass == confirm) {
        const otp = generateOTP.generateOTP();
        console.log(otp);

        const data = {
          email,
          newPass,
          confirm,
          otp,
        };
        req.session.forgotData = data;
        req.session.save();

        const mailOptions = await {
          form: Email,
          to: req.body.email,
          subject: "Your OTP for Verification",
          text: `your otp ${otp}`,
        };
        if (mailOptions) {
          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.log(err.message);
            } else {
              console.log("mail send sucessfull");
            }
          });
        }
        res.json({ status: true });
      } else {
        res.json({ status: "passWro" });
      }
    } else {
      res.json({ status: "emailWro" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/******************************************************LOAD HOME*********************** */

const loadHome = async (req, res) => {
  try {

    const cart=req.session.cart
    const wish=req.session.wish
    const catData = await Category.find({});

    const proData = await Product.find({ stock: { $gt: 0 } });

    const brandData = await Brand.find({});

    const newArrivals = await Product.find({}).sort({ _id: -1 }).limit(6);

    // const findUser=await User.findOne({email:req.session.email})

    // const cart=await Cart.findOne({userId:findUser._id})
    // const proId=[]

    // for(let i=0;i<cart.items.length;i++){
    //   proId.push(cart.items[i].productsId)
    // }

    // for(let i=0;i<proId.length;i++){
    //   proId.push(await Product.findById({_id:proId}))
    // }


    // for(let i=0;i<proData.length;i++){
    //   for(let j=0;catData.length;j++){
    //   if(proData[i].category==catData[i]._id){

    //   }
    //   }
    // }




    // const populate= await Product.find({}).populate(catData)

    // console.log(populate);

    res.render("home", { catData, proData, brandData, newArrivals,cart,wish });
  } catch (error) {
    console.log(error.massage);
  }
};

/********************************************LOAD FORGOT OTP******************** */

const loadForgotOTP = async (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************LOAD DASHBORAD************************** */

const loadDash = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const userData = await User.findOne({ email: req.session.email });
    // console.log(userData._id);

    // const address=await Adderss.find({userId:req.session.userId })
    // console.log(address)

    // console.log(user)
    res.render("userProfile", { userData ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const loadProduct = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const id = req.query.id;
    //  console.log(id,"heloooooooooooooooooooooooooooooooooooooooooooooo")
    const proData = await Product.findById({ _id: id });

    const catgory=await Category.findById({_id:proData.category})
    let discount;
    if(catgory.offer.discount){
      // console.log("CAT OFFFFFFFFFFFFFFFER");
      let amount=(proData.regularPrice*catgory.offer.discount)/100
       discount=proData.regularPrice-amount
      //  console.log("discount");
       console.log(discount);
    }
    console.log(proData.offerPrice);
    let offer;
   
    if(discount<proData.offerPrice){
      // console.log("DISCOUNT IS GRATER");
      offer=discount
      console.log(offer);
    }else{
      // console.log("OFFER IS GRATER");
      offer=proData.offerPrice
      console.log((offer));
    }
    if(offer==null){
      offer=discount
    }
    // console.log(proData)

    const user = req.session.email;
    const totalRating=await Rating.find({productId:proData._id},{star:true})
    const reviews=totalRating.length

    const allRatingData=await Rating.find({productId:proData._id})

    if (proData) {
      const fullData = await Product.find({});
      if (req.session.email) {


        const order=await Order.find({userEmail:req.session.email,status:"Delivered"})
        console.log(order)
        let ratingShow=false
        let product=false

        if(order.length>0){
          // console.log("inside order");
          for(let i=0;i<order.length;i++){
            // console.log("order array");
           for(let j=0;j<order[i].items.length;j++){
            // console.log(("j loop"));
            // console.log("productId  "+proData._id);
            // console.log("orderid  "+order[i].items[j].productsId)
            if(proData._id.toString()===order[i].items[j].productsId.toString()){
              // console.log("product in the order");
              product=true
              break;
            }
           }
          }
          if(product){
            // console.log(("rating Show"));
            ratingShow=true
          }else{
            // console.log("no product");
          }
        }




        const userData = await User.findOne({ email: req.session.email });
        const cartData = await Cart.findOne({
          userId: userData._id,
          "items.productsId": id,
        });

        const catagory=await Category.find({is_blocked:false})
        // console.log("ctrdddddddddddddddddd",cartData)
        if (cartData) {
          // console.log("inside cart")
          const findWish = await Wishlist.findOne({
            user_id: userData._id,
            "products.productId": proData._id,
          });

          res.render("product", {
            proData,
            fullData,
            cartData,
            user,
            findWish,
            ratingShow,
            reviews,
            allRatingData,
            offer,
            cart,
            wish
          });
        } else {

          const findWish = await Wishlist.findOne({
            user_id: userData._id,
            "products.productId": proData._id,
          });

          res.render("product", {
            proData,
            fullData,
            cartData,
            user,
            findWish,
            ratingShow,
            reviews,
            allRatingData,
            offer,
            cart,
            wish
          });
        }
      } else {
        const cartData = null;
        const findWish = null;
        let ratingShow=false
        
    
        res.render("product", { proData, fullData, cartData, user, findWish ,ratingShow,reviews,allRatingData,offer,cart,wish});
      }
    } else {
      res.redirect("/404");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const PNF = async (req, res) => {
  try {
    res.render("404");
  } catch (error) {
    console.log(error.meassge);
  }
};

const resendOtp = async (req, res) => {
  try {
    // console.log("hello");

    const email = req.session.Data.email;
    const resendOtpGen = generateOTP.generateOTP();
    req.session.Data.otp = resendOtpGen;

    const mailOptions = await {
      form: Email,
      to: email,
      subject: "Your OTP for Verification",
      text: `your otp ${resendOtpGen}`,
    };
    if (mailOptions) {
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("mail send sucessfull");
        }
      });
    }

    // if (req.session.forgotData) {
    //   const email = req.session.forgotData.email;
    //   const resendOtpGen = generateOTP();
    //   req.session.forgotData.otp = resendOtpGen;
    //   const mailOptions = await {
    //     form: Email,
    //     to: email,
    //     subject: "Your OTP for Verification",
    //     text: `your otp ${resendOtpGen}`,
    //   };
    //   if (mailOptions) {
    //     transporter.sendMail(mailOptions, (err) => {
    //       if (err) {
    //         console.log(err.message);
    //       } else {
    //         console.log("mail send sucessfull");
    //       }
    //     });
    //   }
    // }

    // req.session.forgotData.otp=resendOtpGen

    // console.log(req.session.Data.otp)

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddaddress = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    res.render("addAddress",{cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const addAddress = async (req, res) => {
  try {
    // console.log(req.body)
    // console.log("inside add address");
    // console.log(req.session.email);
    const findUser = await User.findOne({ email: req.session.email });

    console.log(findUser);

    const {
      name,
      phone,
      pcode,
      city,
      address,
      district,
      state,
      landmark,
      alternate,
      address_type,
    } = req.body;

    const newAddress = new Adderss({
      userId: findUser._id,
      name: name,
      mobile: phone,
      pinCode: pcode,
      city: city,
      address: address,
      district: district,
      state: state,
      landmark: landmark,
      addressType: address_type,
      alternateMobile: alternate,
    });

    const addressData = await newAddress.save();

    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};

const deletAddress = async (req, res) => {
  try {
    const id = req.query.id;

    const dele = await Adderss.findByIdAndDelete({ _id: id });

    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditAddress = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const id = req.query.id;

    const DataAddre = await Adderss.findById({ _id: id });

    req.session.address = DataAddre;
    // console.log(DataAddre);

    res.render("editAddress", { DataAddre,cart,wish });
  } catch (error) {
    console.log(error.message);
  }
};

const editAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      pcode,
      city,
      address,
      district,
      state,
      landmark,
      alternate,
      address_type,
    } = req.body;

    const oldData = req.session.address;

    if (
      name == oldData.name &&
      phone == oldData.mobile &&
      pcode == oldData.pinCode &&
      city == oldData.city &&
      address == oldData.address &&
      district == oldData.district &&
      state == oldData.state &&
      landmark == oldData.landmark &&
      address_type == oldData.address_type &&
      alternate == oldData.alternateMobile
    ) {
      res.json({ status: "nothing" });
    } else {
      const addData = await Adderss.findByIdAndUpdate(
        { _id: oldData._id },
        {
          $set: {
            name: name,
            mobile: phone,
            pinCode: pcode,
            city: city,
            address: address,
            district: district,
            state: state,
            landmark: landmark,
            addressType: address_type,
            alternateMobile: alternate,
          },
        }
      );
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//************************************Dashbord pageLoad******************* */

const loadOrder = async (req, res) => {
  try {
    
    const cart=req.session.cart
    const wish=req.session.wish
    const userData = await User.findOne({ email: req.session.email });

    const orderData = await Order.find({ userId: userData._id }).sort({
      _id: -1,
    }).limit(7)

    // console.log(orderData)

    let previous=false;
    let nextPage=true;
    let newNum=1;

    console.log(previous,'This is prvieus')
    console.log(nextPage,'This is previous')
    console.log(previous,'This is prvieus')



    res.render("Order", { orderData ,cart,wish,previous,nextPage,newNum});
  } catch (error) {
    console.log(error.message);
  }
};

const loadTrack = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish

    console.log("WALTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTET");
    const userData = await User.findOne({ email: req.session.email });
    const userWallet = await Wallet.findOne({ userId: userData._id })
      

    console.log(userWallet)
      

    // console.log(userWallet);

    res.render("wallet", { userWallet ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddress = async (req, res) => {
  try {
    // console.log("hello");
    const cart=req.session.cart
    const wish=req.session.wish
    console.log(req.session.email);
    const address = await Adderss.find({ userId: req.session.userId });
    // console.log(address);
    res.render("adderss", { address ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const loadChangePass = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    res.render("changePassword",{cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const loadAccount = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const findUser = await User.findOne({ email: req.session.email });

    res.render("accountDetalis", { findUser ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const changePass = async (req, res) => {
  try {
    const { current, newPass, conPass } = req.body;

    if (newPass == conPass) {
      const email = req.session.email;

      const userData = await User.findOne({ email: email });

      const passwordMatch = await bcrypt.compare(current, userData.password);

      if (passwordMatch) {
        const passwordHash = await securePassword(newPass);

        const updatePass = await User.findByIdAndUpdate(
          { _id: userData._id },
          {
            $set: {
              password: passwordHash,
            },
          }
        );

        if (updatePass) {
          res.json({ status: true });
        }
      } else {
        res.json({ status: "wrong" });
      }
    } else {
      res.json({ status: "compare" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditAccount = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    // console.log("hello" + req.session.email);
    const userData = await User.findOne({ email: req.session.email });
  
    res.render("Editaccount", { userData ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const editAccount = async (req, res) => {
  try {
    const { name, mobile, dom, gender } = req.body;

    //  const userData=await User.findOne({email:req.session.email})

    // console.log(req.session.email)

    const obj = {
      name: name,
      mobile: mobile,
      DOB: dom,
      gender: gender,
    };

    const updateUser = await User.findOneAndUpdate(
      { email: req.session.email },
      obj
    );

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const loadShop = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish

    const page=req.query.next||0
    const pre=req.query.pre||0
    let number=0
    if(page!=0){
    
      number=parseInt(page)
    }else if(pre!=0){
     
      number=parseInt(pre)-2
    }
    console.log("PAGE",page)
    
    const skip=number*6
    console.log("SKIP",skip)
    const sort = req.query.sort;
    const rating=req.query.rating
    // console.log(sort);
 
      let newNum
      let previous
      if(skip==0){
       
        previous=false;
         newNum=1
        
      }else{
        
        
        previous=true
        newNum=number+1
      }
      


    if (sort == "lowToHigh") {
     
      const proData = await Product.find({}).sort({ regularPrice: 1 }).skip(skip).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage,sort});
    } else if (sort == "highToLow") {
      const proData = await Product.find({}).sort({ regularPrice: -1 }).skip(skip).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage,sort});
    } else if (sort == "aA-zZ") {
      const proData = await Product.find({}).sort({ name: 1 }).skip(skip).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage,sort});
    } else if (sort == "zZ-aA") {
      const proData = await Product.find({}).sort({ name: -1 }).skip(skip).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage,sort});
    }else if(rating==100){
      const proData = await Product.find({rating:100}).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
    }else if(rating==80){
      const proData = await Product.find({rating:80}).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
    }else if(rating==60){
      const proData = await Product.find({rating:60}).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
    }else if(rating==40){
      const proData = await Product.find({rating:40}).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
    }else if(rating==20){
      const proData = await Product.find({rating:20}).limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
    }

    const proData = await Product.find({}).skip(skip).limit(6);
    const catData = await Category.find({});
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});
    let nextPage;
    if(proData.length>=6){
      nextPage=true
    }else{
      nextPage=false
    }

    res.render("shop", { proData, catData, newPro, brandData ,newNum,previous,cart,wish,nextPage});
  } catch (error) {
    console.log(error.message);
  }
};

const loadCoupon = async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.session.email });

    const cart=req.session.cart
    const wish=req.session.wish
    
    const date=generateDate()
    console.log(date)

    const CouponDataArray = await Coupon.find({
      users: { $nin: [findUser._id] },
      EndDate:{ $gte: date },
      isActive:true
    });

    const readeemCoupon = await Coupon.find({
      users: { $in: [findUser._id] },
    });

    // console.log(readeemCoupon);

    res.render("coupon", { CouponDataArray, readeemCoupon ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const loadInvoice=async(req,res)=>{
  try {
    const id=req.query.id
    console.log(id)
    const findOrder=await Order.findById({_id:id})


    const proId = [];

    for (let i = 0; i < findOrder.items.length; i++) {
      proId.push(findOrder.items[i].productsId);
    }

    const proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    
    console.log(proData)
    console.log(findOrder)



    res.render("invoice",{proData, findOrder})
    
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadLanding,
  loadRegister,
  insertUser,
  loadOtp,
  getOtp,
  loadLogin,
  verifylogin,
  loadForgot,
  logout,
  loadHome,
  forgot,
  loadForgotOTP,
  loadDash,
  loadProduct,
  PNF,
  resendOtp,
  loadAddaddress,
  addAddress,
  deletAddress,
  loadEditAddress,
  loadOrder,
  loadAccount,
  loadAddress,
  loadChangePass,
  loadTrack,
  editAddress,
  changePass,
  loadEditAccount,
  editAccount,
  loadShop,
  loadCoupon,
  loadInvoice
};