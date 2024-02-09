  

  const Category=require("../model/categoryModel")
  const Brand=require("../model/brandModel")

  const Product=require("../model/productModel")


const loadProduct=async(req,res)=>{
    try {
          const proData=await Product.find({})
          console.log(proData)
        res.render("adminProduct",{proData})
    } catch (error) {
        console.log(error.message)
    }
}

const loadAdd=async(req,res)=>{
    try {
        const catData= await Category.find({})
        const brandData= await Brand.find({})
        
        res.render('addProduct',{catData,brandData})
    } catch (error) {
        console.log(error.message)
    }
}

const addProduct=async(req,res)=>{
    try {

        console.log("hello");

        console.log(req.body)
    //  console.log(req.files);
        const imageName=req.files.map((x)=>x.originalname)
         
    //    console.log(req.file.filename)

        const product=new Product({
            name:req.body.product_name,
            discripiton:req.body.product_dis,
            regularPrice:req.body.regprice,
            offerPrice:req.body.offprice,
            stock:req.body.stock,
            offPercentage:req.body.off,
            image:imageName,
            category:req.body.catName,
            brand:req.body.brandName,
            color:req.body.color
        })

        const proData=await product.save()
        if(proData){
            res.redirect("/admin/product")
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loadEdit=async(req,res)=>{
    try {
        const id=req.query.id
        req.session.id=id;
         const proData=await Product.findById({_id:id})
        const brandData=await Brand.find({})

        const catData=await Category.find({})
        res.render("editProduct",{brandData,catData,proData})
    } catch (error) {
        console.log(error.message);
    }
}

const editPro=async(req,res)=>{
    try {
          const id=req.body.id

          console.log(id)
          
          const imageName=req.files.map((x)=>x.originalname)
          const updatePro=await Product.findByIdAndUpdate({_id:id},{
            $set:{
                name:req.body.product_name,
                discripiton:req.body.product_dis,
                regularPrice:req.body.regprice,
                offerPrice:req.body.offprice,
                stock:req.body.stock,
                offPercentage:req.body.off,
                image:imageName,
                category:req.body.catName,
                brand:req.body.brandName,
                color:req.body.color
            }
          })

          if(updatePro){
            res.redirect("/admin/product")
          }

          

    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadProduct,
    loadAdd,
    addProduct,
    loadEdit,
    editPro
}