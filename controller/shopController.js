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
    const cart=req.session.cart
    const wish=req.session.wish
    const num =req.query.page;
    // const sort=req.query.sort;
    console.log("NUMBER")
    console.log(num)
    // console.log(sort)
    console.log(typeof num);
    console.log(num)

    const number =parseInt(num);
    const skip = number * 6;
    console.log(skip);

    const proData = await Product.find({ is_blocked: false })
      .skip(skip)
      .limit(6);
    console.log(proData)
    const catData = await Category.find({ is_blocked: false });
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});
    let previous=true
   

    let nextPage;
    if(proData.length>=6){
      nextPage=true
    }else{
      nextPage=false
    }
    let newNum = number+ 1;

    
    // res.json({status:true,page:newNum})
    res.render("shop", { proData, catData, newPro, brandData, newNum ,previous,wish,cart,nextPage});
  } catch (error) {
    console.log(error.message);
  }
};

const categoryfilter = async (req, res) => {
  try {
    const id = req.query.id;
    const sort = req.query.sort;
    const rating=req.query.rating

    let newNum = 1
    let previous=false

    // console.log(id);
    // console.log(sort);

    if (sort == "lowToHigh") {
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({
        category: findCat._id,
        is_blocked: false,
      })
        .sort({ regularPrice: 1 })
        .limit(6);
      const catData = await Category.find({ is_blocked: false });
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    } else if (sort == "highToLow") {
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({
        category: findCat._id,
        is_blocked: false,
      })
        .sort({ regularPrice: -1 })
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("catagory", { proData, catData, newPro, brandData, findCat,newNum,previous,nextPage });
    } else if (sort == "aA-zZ") {
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({
        category: findCat._id,
        is_blocked: false,
      })
        .sort({ name: 1 })
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }

      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    } else if (sort == "zZ-aA") {
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, })
        .sort({ name: -1 })
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }

      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    } else if(rating==100) {
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, rating:100 })
        
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }

      res.render("catagory", { proData, catData, newPro, brandData, findCat,newNum,previous,nextPage });
    }else if(rating==80){
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, rating:80 })
        
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("catagory", { proData, catData, newPro, brandData, findCat,newNum,previous ,nextPage});
    }else if(rating==60){
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, rating:60 })
        
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    }else if(rating==40){
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, rating:40 })
        
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }

      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    }else if(rating==20){
      const findCat = await Category.findById({ _id: id });
      const proData = await Product.find({ category: findCat._id, is_blocked: false, rating:20 })
        
        .limit(6);
      const catData = await Category.find({});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }

      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});
    }




    const findCat = await Category.findById({ _id: id });

    const proData = await Product.find({
      category: findCat._id,
      is_blocked: false,
    }).limit(6);
    const catData = await Category.find({ is_blocked: false });
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});
    let nextPage;
    if(proData.length>=6){
      nextPage=true
    }else{
      nextPage=false
    }

    res.render("catagory", { proData, catData, newPro, brandData, findCat,newNum,previous ,nextPage});
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
    res.render("shop", { proData, catData, newPro, brandData,newNum,previous });
  } catch (error) {
    console.log(error.message);
  }
};

const loadWishlist = async (req, res) => {
  try {
    const cart=req.session.cart
    const wish=req.session.wish

    const findUser = await User.findOne({ email: req.session.email });

    const wishData = await Wishlist.findOne({ user_id: findUser._id });

    let proId = [];

    for (let i = 0; i < wishData.products.length; i++) {
      proId.push(wishData.products[i].productId);
    }

    let proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    console.log(proData);

    const cartData = [];

    for (let i = 0; i < proId.length; i++) {
      cartData.push(
        await Cart.findOne({
          userId: findUser._id,
          "items.productsId": proId[i],
        })
      );
    }

    console.log(cartData, "caaaaaaaaaaartttttttttt");

    res.render("wishList", { wishData, proData ,cart,wish});
  } catch (error) {
    console.log(error.message);
  }
};

const addWishlist = async (req, res) => {
  try {
    const id = req.body.id;
    //    console.log("hello")
    const findUer = await User.findOne({ email: req.session.email });
    // console.log(("find Usernnnnnnnnnnnnnnnnnnnn",findUer));
    const findProData = await Product.findById({ _id: id });
    // console.log("proDataaaaaaaaaaaaaaaaaaaaaa",findProData)
    if (findUer) {
      const userFind = await Wishlist.findOne({ user_id: findUer._id });
      //   console.log("usrFinddddddddddddddddddddddddddddd",userFind )

      if (userFind) {
        let proWish = false;
        for (let i = 0; i < userFind.products.length; i++) {
          if (findProData._id === userFind.products[i].productId) {
            proWish = true;
            break;
          }
        }
        // console.log(proWish,"prrrrrrrrrrowwwwwwwwwwwwissssssssssssh")
        if (proWish) {
          res.json({ status: "already" });
        } else {
          // console.log("eeeeeeeeeeeelseeeeeeeeeeeeeeeeeeeeeeeessssssss")
          const updateWish = await Wishlist.findOneAndUpdate(
            { user_id: findUer._id },
            {
              $push: {
                products: {
                  productId: findProData._id,
                },
              },
            }
          );
        }
      } else {
        // console.log("userfind else worked")
        const wishList = new Wishlist({
          user_id: findUer._id,
          products: [
            {
              productId: findProData._id,
            },
          ],
        });
        const wishlist = wishList.save();
      }
      res.json({ status: true });
    } else {
      res.json({ status: "login" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeWish = async (req, res) => {
  try {
    const id = req.body.id;
    const findUser = await User.findOne({ email: req.session.email });

    const dalePro = await Wishlist.findOneAndUpdate(
      { user_id: findUser._id },
      {
        $pull: { products: { productId: id } },
      }
    );

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromwishlist = async (req, res) => {
  try {
    const id = req.body.id;
    const findUser = await User.findOne({ email: req.session.email });

    const dalePro = await Wishlist.findOneAndUpdate(
      { user_id: findUser._id },
      {
        $pull: { products: { productId: id } },
      }
    );

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const search = async (req, res) => {
  try {
    const value = req.body.search;

    const searchValue = await Product.find({
      name: { $regex: value, $options: "i" },
    });

    res.json({ status: true, result: searchValue });
  } catch (error) {
    console.log(error.message);
  }
};

const previousPage=async(req,res)=>{
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const num=req.query.page
    // console.log(num)
    const number = parseInt(num)-1;
    console.log("nummmmmmmmmmmmmmmmmmbbbbbb"+number)
    const skip = number * 6;
    console.log(skip);

    if(number==1){
      const proData = await Product.find({ is_blocked: false })
      .limit(6);
      const catData = await Category.find({ is_blocked: false });
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let previous=false
      let newNum=number
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("shop", { proData, catData, newPro, brandData, newNum ,previous,cart,wish,nextPage});
    }

    const proData = await Product.find({ is_blocked: false })
      .skip(skip)
      .limit(6);
    const catData = await Category.find({ is_blocked: false });
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});

    let newNum = number 

    console.log("nnnnnnnnnnew numbbbbbbber"+newNum)
      let previous=true
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
    
    res.render("shop", { proData, catData, newPro, brandData, newNum ,previous,cart,wish,nextPage});
  } catch (error) {
    console.log(error.message)
  }
}

const searchProducts = async(req,res)=>{
  try{
    console.log("hello");
      const {searchDataValue} = req.body
      const searchProducts = await Product.find({name:{
          $regex: searchDataValue , $options: 'i'
      }})
      // console.log(searchProducts);
      console.log(searchProducts)
      res.json({status:"searched",searchProducts})

  }catch(err){
      console.log(err);
    }
 }


const categoryNextpage=async(req,res)=>{
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const num = req.query.page;
    const id=req.query.id

    const number = parseInt(num);
    const skip = number * 6;
    const findCat=await Category.findById({_id:id})

    const proData=await Product.find({category:findCat._id,is_blocked:false}) .skip(skip)
    .limit(6);

    let newNum = parseInt(num) + 1;
    let previous=true
    
    let nextPage;
    if(proData.length>=6){
      nextPage=true
    }else{
      nextPage=false
    }
      

      const catData = await Category.find({is_blocked:false});
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({is_blocked:false});

      res.render("catagory", { proData, catData, newPro, brandData, findCat ,newNum,previous,nextPage});


    
  } catch (error) {
    console.log(error.message)
  }
}

const categoryPreviousPage=async(req,res)=>{
  try {
    const cart=req.session.cart
    const wish=req.session.wish
    const num = req.query.page;
    const id=req.query.id

    const number = parseInt(num)-1;
    const skip = number * 6;
    const findCat=await Category.findById({_id:id})

    if(number==1){
      const proData = await Product.find({category:findCat._id,is_blocked:false })
      .limit(6);
      const catData = await Category.find({ is_blocked: false });
      const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
      const brandData = await Brand.find({});
      let previous=false
      let newNum=number
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
      res.render("catagory", { proData, catData, newPro, brandData, newNum ,previous,findCat,cart,wish,nextPage});
    }

    
    const proData = await Product.find({ category:findCat._id,is_blocked: false })
      .skip(skip)
      .limit(6);
    const catData = await Category.find({ is_blocked: false });
    const newPro = await Product.find({}).sort({ _id: -1 }).limit(3);
    const brandData = await Brand.find({});

  
    
    let newNum = number 

    // console.log("nnnnnnnnnnew numbbbbbbber"+newNum)
      let previous=true
      let nextPage;
      if(proData.length>=6){
        nextPage=true
      }else{
        nextPage=false
      }
    
    res.render("catagory", { proData, catData, newPro, brandData, newNum ,previous,findCat,cart,wish,nextPage});

    
  } catch (error) {
    console.log(error.message)
  }
}



module.exports = {
  nextPage,
  categoryfilter,
  brandFilter,
  loadWishlist,
  addWishlist,
  removeWish,
  removeFromwishlist,
  search,
  previousPage,
  searchProducts,
  categoryNextpage,
  categoryPreviousPage
};