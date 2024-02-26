const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");
const Adderss = require("../model/addressModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Wishlist = require("../model/wishlistModel");

// const loadWithlowtoHigh=async(req,res)=>{
//     try {

//        const proData=await Product.find({}).sort({offerPrice:1}).limit(6)

//     //    const proData=await Product.find({})

//     const catData=await Category.find({})
//     const newPro=await Product.find({}).sort({_id:-1}).limit(3)
//     const brandData= await Brand.find({})

//     res.render("shop",{proData,catData,newPro,brandData})

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const highTolow=async(req,res)=>{
//     try {

//         const proData=await Product.find({}).sort({offerPrice:-1}).limit(6)

//     //    const proData=await Product.find({})

//     const catData=await Category.find({})
//     const newPro=await Product.find({}).sort({_id:-1}).limit(3)
//     const brandData= await Brand.find({})

//     res.render("shop",{proData,catData,newPro,brandData})

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const AtoZ=async(req,res)=>{
//     try {

//         const proData=await Product.find({}).sort({name:1}).limit(6)

//     //    const proData=await Product.find({})

//     const catData=await Category.find({})
//     const newPro=await Product.find({}).sort({_id:-1}).limit(3)
//     const brandData= await Brand.find({})

//     res.render("shop",{proData,catData,newPro,brandData})

//     } catch (error) {
//         console.log(error.message)
//     }
// }
// const ZtoA=async(req,res)=>{
//     try {

//         const proData=await Product.find({}).sort({name:-1}).limit(6)

//     //    const proData=await Product.find({})

//     const catData=await Category.find({})
//     const newPro=await Product.find({}).sort({_id:-1}).limit(3)
//     const brandData= await Brand.find({})

//     res.render("shop",{proData,catData,newPro,brandData})

//     } catch (error) {
//         console.log(error.message)
//     }
// }

const nextPage = async (req, res) => {
  try {
    const num = req.body.number;
    const skip = num * 6;

    const proData = await Product.find({}).skip(skip).limit(6);

    //    const proData=await Product.find({})

    const catData = await Category.find({});
    const newPro = await Product.find({}).skip(skip).limit(6);
    const brandData = await Brand.find({});

    res.render("shop", { proData, catData, newPro, brandData });
  } catch (error) {
    console.log(error.message);
  }
};

const categoryfilter = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);

    const findCat = await Category.findById({ _id: id });

    const proData = await Product.find({ category: findCat._id }).limit(6);

    // const proData=await Product.find({}).sort({name:-1}).limit(6)
    const catData = await Category.find({});
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});
    res.render("shop", { proData, catData, newPro, brandData });
  } catch (error) {
    console.log(error.message);
  }
};

const brandFilter = async (req, res) => {
  try {
    const id = req.query.id;

    const findBrand = await Brand.findById({ _id: id });

    const proData = await Product.find({ brand: findBrand.name }).limit(6);
    // const proData=await Product.find({}).sort({name:-1}).limit(6)
    const catData = await Category.find({});
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});
    res.render("shop", { proData, catData, newPro, brandData });
  } catch (error) {
    console.log(error.message);
  }
};

const loadWishlist = async (req, res) => {
  try {
    res.render("wishList");
  } catch (error) {
    console.log(error.message);
  }
};

const addWishlist = async (req, res) => {
  try {
    const id = req.body.id;

    const findUer = await User.findOne({ email: req.session.email });


    if (findUer) {

        const userFind=await Wishlist.findOne({user_id:findUer._id})

        if(userFind){
            let proWish=false
            for(let i=0;i<userFind.products.length;i++){
               
            }

        }else{

        }

      const proData = await Product.findOne({ _id: id });

      const already=await Wishlist.findOne({user_id:findUer._id,"products.productId":proData._id})

        
      const wishList = new Wishlist({
        user_id: findUer._id,
        products: [
          {
            productId: proData._id,
          },
        ],
      });
      const wishlist = wishList.save();

      res.json({ status: true });
    } else {
        res.json({status:"login"})
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  nextPage,
  categoryfilter,
  brandFilter,
  loadWishlist,
  addWishlist,
};
