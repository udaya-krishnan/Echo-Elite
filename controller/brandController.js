  
const Brand=require("../model/brandModel")

const loadBrand=async(req,res)=>{
    try {
        const brandData= await Brand.find({})
//   console.log(brandData)
        res.render("adminBrand",{brandData})
    } catch (error) {
        console.log(error.message)
    }
}

const loadAdd=async(req,res)=>{
    try {
        res.render("addBrand")
    } catch (error) {
        console.log(error.message)
    }
}
 
const addBrand=async(req,res)=>{
  try {
   
      const newName=req.body.name

      const unique=Brand.findOne({name:newName})
      
      if(!unique){
        const brand=new Brand({
            name:newName,
            image:req.file.filename 
         })
      const brandData= await brand.save()
      res.redirect("/admin/brand")
      }else{
        res.render("addBrand",{message:"name is already exists"})
      }
       
 

  } catch (error) {
    console.log(error.message)
  }
}

const listBrand=async(req,res)=>{
    try {
        const id=req.query.id

        const findBrand=await Brand.findById({_id:id})
        if(findBrand.is_blocked===true){
            const brandData= await Brand.findByIdAndUpdate({_id:id},{
                $set:{
                    is_blocked:false
                }
            })
        }else{
            const brandData= await Brand.findByIdAndUpdate({_id:id},{
                $set:{
                    is_blocked:true
                }
            })
        }
 
        res.redirect('/admin/brand')
    } catch (error) {
        console.log(error.message)
    }
}

   
const editload=async(req,res)=>{
    try {
        const id=req.query.id
        // console.log(id)

        const brandData= await Brand.findById({_id:id})

        // console.log(catData)
       const {name,image}=brandData

      const data={
        name,
        image
      }

      req.session.BrandData=data
    
      req.session.save();
        res.render("editBrand",{data})
    } catch (error) {
       console.log(error.message) 
    }
}
  

const editBrand=async(req,res)=>{
    try {

          
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    loadBrand,
    loadAdd,
    addBrand,
    listBrand,
    editload
}