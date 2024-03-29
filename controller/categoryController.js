const Category=require("../model/categoryModel")
const mongoose=require("mongoose")

const loadCategory=async(req,res)=>{
    try {
      const catData= await Category.find({})
       res.render("adminCatagory",{catData})
    } catch (error) {
     console.log(error.message)
    }
  }

const loadCreate=async(req,res)=>{
    try {
        res.render("addCategory")
    } catch (error) {
        console.log(error.message)
    }
}

const addCate=async(req,res)=>{
    try {
        
        const name=req.body.name
        const dis=req.body.dis
    //   console.log(name+"    heloo   "+dis)
        const allData=await Category.find({})
    
   const allName=allData.map((x)=>x.name)

   let unique=false;
   for(i=0;i<allName.length;i++){
    if(name.toLowerCase()==allName[i].toLowerCase()){
        unique=true
    }
   }

        if(unique){
            res.json({status:"unique"})
        }else{

            const cat=new Category({
                name:name,
                discription:dis
            })
            
            const catData=cat.save()

            res.json({status:true})
        }
    
      
    } catch (error) {
        console.log(error.message)
    }
}

const listCat=async(req,res)=>{
    try {
        // console.log("list Id"+req.body.catId)

        const id=req.body.catId
     
        // console.log(id)
           
        const findCat=await Category.findById({_id:id})

        if(findCat.is_blocked===true){
            const catData= await Category.findByIdAndUpdate({_id:id},{
                $set:{
                    is_blocked:false
                }
            })
            // console.log("unlisssssssssssssssssssssssssssssssssssssssyttttttttttt")
            res.json({status:"unlist"})
        }else{
            const catData= await Category.findByIdAndUpdate({_id:id},{
                $set:{
                    is_blocked:true
                }
            })

            // console.log("listttttttttttttttttttttttttttttt")
            res.json({status:"list"})
        }

        // res.json({status:true})

        

    } catch (error) {
        console.log(error.message)
    }
}


const loadEdit=async(req,res)=>{
    try {
        const id=req.query.id
        // console.log(id)

        const catData= await Category.findById({_id:id})

        // console.log(catData)
       const {name,discription}=catData

      const data={
        name,
        discription
      }

      req.session.catData=data
    
      req.session.save();

        res.render("editCategory",{catData})

    } catch (error) {
        console.log(error.message)
    }
}

const editCat=async(req,res)=>{
    try {

        
        const name=req.body.name
        const dis=req.body.dis
        const id=req.body.id
        // console.log(name)
  
   const allData=await Category.find({})
    
   const allName=allData.map((x)=>x.name)

   let unique=false;
   for(i=0;i<allName.length;i++){
    if(name.toLowerCase()==allName[i].toLowerCase()){
        unique=true
    }
   }
         
   if(name==req.session.catData.name){
    unique=false;
   }

     
          if(unique){
            // console.log("hello");
                res.json({status:"unique"})
          }else{

            const catData= await Category.findOneAndUpdate({_id:id},{
                $set:{
                    name:name,
                    discription:dis
                }
            })
        
           res.json({status:true})
          }

           
    } catch (error) {
        console.log(error.message)
    }
}

const cancelCat=async(req,res)=>{
    try {
   
        const newName=req.body.name
        const newDis=req.body.dis

        const {name,discription}=req.session.catData
        
        if(newName==name&&newDis==discription){          
            res.json({status:"Nothing"})
        }else{
            res.json({status:true})
        }
        
        
    } catch (error) {
        console.log(error.message)
    }
}

const loadCategoryOffer=async(req,res)=>{
    try {
        const findCat=await Category.find({is_blocked:false})
        res.render("offerCategory",{findCat})
        
    } catch (error) {
        console.log(error.message)
    }
}

const addOfferLoad=async(req,res)=>{
    try {
        const catData = await Category.find({
            is_blocked: false,
            $or: [
                { offer: { $exists: false } }, 
                { offer: false }    
            ]
        });
        console.log(catData)
        res.render("addOffer",{catData})
    } catch (error) {
       console.log(error.message) 
    }
}

const addOffer=async(req,res)=>{
    try {
        const {discount,startDate,endDate,catname}=req.body
        // console.log(discount,startDate,endDate,catname) 
        console.log(typeof catname )
        
  
        const findCat=await Category.findOne({name:catname})
        // console.log(findCat)
     
         const updateCat=await Category.findByIdAndUpdate({_id:findCat._id},{
            $set:{
                offer:{
                    discount:discount,
                    startDate:startDate,
                    endDate:endDate
                }
            }
         })

         res.json({status:true})
    } catch (error) {
        console.log(error.message)
    }
}


const deleteOffer=async(req,res)=>{
    try {
        const id=req.body.id
        console.log(id)
        const findCat=await Category.findByIdAndUpdate({_id:id},{
            $unset:{offer:""}
        })

        res.json({status:true})
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadCategory,
    loadCreate,
    addCate,
    listCat,
    loadEdit,
    editCat,
    cancelCat,
    loadCategoryOffer,
    addOfferLoad,
    addOffer,
    deleteOffer
}