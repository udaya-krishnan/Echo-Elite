const Category = require("../model/categoryModel");
const Brand = require("../model/brandModel");

const Product = require("../model/productModel");

const loadProduct = async (req, res) => {
  try {
    const proData = await Product.find({});
    console.log(proData);
    res.render("adminProduct", { proData });
  } catch (error) {
    console.log(error.message);
  }
};

const loadAdd = async (req, res) => {
  try {
    const catData = await Category.find({});
    const brandData = await Brand.find({});

    res.render("addProduct", { catData, brandData });
  } catch (error) {
    console.log(error.message);
  }
};

const addProduct = async (req, res) => {
  try {
    console.log("hello");

    console.log(req.body);

    const catData=await Category.findOne({name:req.body.catName})
    //  console.log(req.files);
    const imageName = req.files.map((x) => x.originalname);

    //    console.log(req.file.filename)
  
    const product = new Product({
      name: req.body.product_name,
      discripiton: req.body.product_dis,
      regularPrice: req.body.regprice,
      offerPrice: req.body.offprice,
      stock: req.body.stock,
      // offPercentage: req.body.off,
      image: imageName,
      category: catData._id,
      brand: req.body.brandName,
      color: req.body.color,
      is_blocked: false,
    });

    const proData = await product.save();
    if (proData) {
      res.redirect("/admin/product");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadEdit = async (req, res) => {
  try {
    const id = req.query.id;
    req.session.id = id;
    const proData = await Product.findById({ _id: id });
    const brandData = await Brand.find({});

    const catData = await Category.find({});
    res.render("editProduct", { brandData, catData, proData });
  } catch (error) {
    console.log(error.message);
  }
};

const editPro = async (req, res) => {
  try {
    const id = req.body.id;


    console.log(id);
    if (req.files.length > 0) {

      const catData=await Category.findOne({name:req.body.catName})
 
        // console.log(req.files,"ffffffffffffffffffffffffffffffffffffffff")
      const imageName    = req.files.map((x) => x.originalname);
      const updatePro = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.product_name,
            discripiton: req.body.product_dis,
            regularPrice: req.body.regprice,
            offerPrice: req.body.offprice,
            stock: req.body.stock,
            // offPercentage: req.body.off,
            image: imageName,
            category: catData._id,
            brand: req.body.brandName,
            color: req.body.color,
          },
        }
      );
      if (updatePro) {
        res.redirect("/admin/product");
      }
    } else {
      console.log(req.body.catName+"catttttttttttttttttttttttttttttttt")
      const catData=await Category.findOne({name:req.body.catName})
      const updatePro = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.product_name,
            discripiton: req.body.product_dis,
            regularPrice: req.body.regprice,
            offerPrice: req.body.offprice,
            stock: req.body.stock,
            // offPercentage: req.body.off,
            category: catData._id,
            brand: req.body.brandName,
            color: req.body.color,
          },
        }
      );
      if (updatePro) {
        res.redirect("/admin/product");
      }
    }

    //   console.log(imageName,"ffffffffffffffffffffffffffffffffffffffffff");

    
  } catch (error) {
    console.log(error.message);
  }
};



const imagDelete = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

const blockPro = async (req, res) => {
  try {
    const id = req.query.id;
    const findPro = await Product.findById({ _id: id });
    if (findPro.is_blocked == false) {
      const blockPro = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_blocked: true,
          },
        }
      );
    } else {
      const blockPro = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_blocked: false,
          },
        }
      );
    }
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};

// const productDetails=async(req,res)=>{
//     try {
//         // res.render()
//     } catch (error) {
//         console.log(error.message)
//     }
// }

module.exports = {
  loadProduct,
  loadAdd,
  addProduct,
  loadEdit,
  editPro,
  blockPro,
};
