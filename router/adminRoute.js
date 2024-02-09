  const express=require('express')
  const admin_route=express()

   admin_route.set('view engine','ejs')
   admin_route.set('views','./views/adminView')

   const multer=require("multer")
   const path=require("path")

   const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname,'../public/brandImages'))
    },
    filename:function(req,file,cb){
      const name=Date.now()+'-'+file.originalname;
      cb(null,name)
    }
   })


   const proStorage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname,'../public/productImages'))
    },
    filename:function(req,file,cb){
     
      cb(null, file.originalname)
    }
   })

   

   const upload= multer({storage:storage})

   const proUpload=multer({storage:proStorage})

   const adminController=require('../controller/adminController')
   const CategoryControle=require("../controller/categoryController")
   const productControle=require("../controller/productController")
   const brandControle=require("../controller/brandController")
   const isAdmin=require("../middleware/adminAuth")


   admin_route.get('/',adminController.adminLogin)
   admin_route.post('/login',adminController.verifyAdmin)
   admin_route.get('/logout',isAdmin,adminController.logout)
   admin_route.get('/dashboard',isAdmin,adminController.loadDash)
   admin_route.get('/sellers',isAdmin,adminController.loadSellers)
 
   admin_route.get('/block-user',isAdmin,adminController.blockUser)

  //  admin_route.get('/block-user',adminController.unblockUser)  
   admin_route.get('/unblock-user',isAdmin,adminController.unblockUser)
  



   //*********************************Category Controller*********************** */
   admin_route.get('/category',isAdmin,CategoryControle.loadCategory)
   admin_route.get("/addCategory",isAdmin,CategoryControle.loadCreate)
   admin_route.post("/addCategoryPost",isAdmin,CategoryControle.addCate)

   admin_route.get("/cat-list",isAdmin,CategoryControle.listCat)
   admin_route.get("/cat-edit",isAdmin,CategoryControle.loadEdit)

   admin_route.post("/editCategoryPost",isAdmin,CategoryControle.editCat)

   admin_route.post("/cat-cancel",isAdmin,CategoryControle.cancelCat)

   /*******************************************Product Route***************************** */

   admin_route.get("/product",isAdmin,productControle.loadProduct)

   admin_route.get("/addProduct",isAdmin,productControle.loadAdd)

   admin_route.post("/addProduct",isAdmin,proUpload.array("proImage" ,5),productControle.addProduct)

   admin_route.get("/edit-pro",isAdmin,productControle.loadEdit)

   admin_route.post("/edit-pro",isAdmin,proUpload.array("proImage",5),productControle.editPro)

   admin_route.get('/block-pro')



   /***************************************Brand Route**************************** */

   admin_route.get("/brand",brandControle.loadBrand)
   admin_route.get("/add-brand",brandControle.loadAdd)

  admin_route.post("/add-brand",upload.single('image'),brandControle.addBrand)
  admin_route.get("/brand-list",brandControle.listBrand)
  admin_route.get("/brand-edit",brandControle.editload)
 
   module.exports=admin_route;
   