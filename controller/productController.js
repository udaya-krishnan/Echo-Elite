const Category = require("../model/categoryModel");
const Brand = require("../model/brandModel");
const Rating=require("../model/ratingModel")
const Product = require("../model/productModel");
const generateDate=require("../controller/dateGenrator")

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
    // if (req.files.length > 0) {

      // const catData=await Category.findOne({name:req.body.catName})
 
      //   // console.log(req.files,"ffffffffffffffffffffffffffffffffffffffff")
      // const imageName    = req.files.map((x) => x.originalname);
      // const updatePro = await Product.findByIdAndUpdate(
      //   { _id: id },
      //   {
      //     $set: {
      //       name: req.body.product_name,
      //       discripiton: req.body.product_dis,
      //       regularPrice: req.body.regprice,
      //       offerPrice: req.body.offprice,
      //       stock: req.body.stock,
      //       // offPercentage: req.body.off,
      //       image: imageName,
      //       category: catData._id,
      //       brand: req.body.brandName,
      //       color: req.body.color,
      //     },
      //   }
      // );
      // if (updatePro) {
      //   res.redirect("/admin/product");
      // }
    // } else {
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
    // }

    //   console.log(imageName,"ffffffffffffffffffffffffffffffffffffffffff");

    
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

const ratingProduct=async(req,res)=>{
  console.log("out side try")
  try {
    console.log("hello hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    const {name,dis,email,rating,id}=req.body
    console.log(name,dis,email,rating,id)

   
      const findPro=await Product.findById({_id:id})
    const date=generateDate()

    const newRating=new Rating({
      productId:findPro._id,
      name:name,
      description:dis,
      email:email,
      date:date,
      star:rating
    })

    const saveRating=await newRating.save()

    if(saveRating){
      console.log("INSIDE THE SAVE RATING");
      const totalRating=await Rating.find({productId:findPro._id},{star:true})

      console.log(totalRating)
      let total=[]
      for(let i=0;i<totalRating.length;i++){
        total.push(totalRating[i].star)
      }
      console.log(total)
      const sumTotal=total.reduce((acc,curr)=>acc+curr)
      console.log(sumTotal)
      const avgTotal=sumTotal/totalRating.length
      console.log(avgTotal)
      let totalAvg=(avgTotal*2)*10
      console.log("AVG TOTAL",totalAvg);
      const updateProduct=await Product.findByIdAndUpdate({_id:id},{
        $set:{
          rating:totalAvg
        }
      })
      res.json({status:true,avg:totalAvg,id:findPro._id})
    }
    
    
   

    

   



  } catch (error) {
    console.log(error.message)
  }
}

const imageEdit=async(req,res)=>{
  try {
    const{id,index}=req.body
    console.log(id,index)

    const findPro=await Product.findById({_id:id})

    findPro.image.splice(index,1,"Nil")
    findPro.save()
    console.log(findPro)


    res.json({status:true})




  } catch (error) {
    
  }
}

const singleImage=async(req,res)=>{
  try {
    console.log(req.body)
    const {id,index}=req.body
    const image=req.body.name
    // console.log( single)
    console.log(image);
   
    // console.log(single);
    const findPro=await Product.findById({_id:id})

    findPro.image.splice(index,1,image)
   await findPro.save()
    res.json({status:true})

  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
  loadProduct,
  loadAdd,
  addProduct,
  loadEdit,
  editPro,
  blockPro,
  ratingProduct,
  imageEdit,
  singleImage
};