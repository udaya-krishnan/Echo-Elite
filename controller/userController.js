const User = require("../model/userModel");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generateOTP = require("../controller/otpGenrate");

const Category=require("../model/categoryModel")
const Product=require("../model/productModel")
const Brand=require("../model/brandModel")

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
    res.render("landing");
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
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    const confirm = req.body.confirm;

    console.log(email);
    console.log(mobile);

    // res.redirect('/otp')
    const otp = generateOTP();
    console.log(otp)
    //     // console.log(otp);
    //      const {name,email,mobile,password,confirm}=req.body
    const existsEmail = await User.findOne({ email: email });
    const existsMobile = await User.findOne({ mobile: mobile });

    if (existsEmail) {
      res.json({ status: "emailErr" });
    } else if (existsMobile) {
      res.json({ status: "mobilErr" });
    } else {
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
    const gotOtp =req.body.otp;
    // console.log(gotOtp)
      // console.log(req.session.Data.otp);
    console.log(gotOtp)
    if (req.session.Data) {
      // console.log('hello');
        //  console.log(req.session.Data.otp)
      if (gotOtp == req.session.Data.otp) {
        const passwordHash = await securePassword(req.session.Data.password);
        const user = new User({
          name: req.session.Data.name,
          email: req.session.Data.email,
          mobile: req.session.Data.mobile,
          password: passwordHash,
          is_admin: 0,
          is_verified: 1,
        });
        const userData = await user.save(); 
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

    req.session.email = email;

   

    const userData = await User.findOne({ email: email });
    // console.log(userData);
    console.log(userData)
    if(userData){
    if (userData.is_blocked==false) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.auth=true
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
  }else{
    res.json({ status:"emailErr"})
  }
  } catch (error) {
    console.log(error.message);
  }
};

/*********************************************LOGOUT*************************** */

const logout = async (req, res) => {
  try {
    
    req.session.email=null
  
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
    console.log("hello");
    const email = req.body.email;
    const newPass = req.body.newPass;
    const confirm = req.body.confirm;
    const Data = await User.findOne({ email: email });
    if (Data) {
      if (newPass == confirm) {
        const otp = generateOTP();
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
  
    const catData= await Category.find({})

    const proData=await Product.find({})

    const brandData=await Brand.find({})

    res.render("home",{catData,proData,brandData});
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
    const userData = await User.findById({ _id: req.session.userId });
    // console.log(user)
    res.render("userProfile", { userData });
  } catch (error) {
    console.log(error.message);
  }
};


const loadProduct=async(req,res)=>{
  try {
      const id=req.query.id

      const proData= await Product.findById({_id:id})

      const fullData=await Product.find({})
   

    res.render("product",{proData,fullData})
  } catch (error) {
    console.log(error.message)
  }
}


const PNF=async(req,res)=>{
  try {
    res.render("404")
  } catch (error) {
    console.log(error.meassge);
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
  PNF
};
