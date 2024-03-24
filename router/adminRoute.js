const express = require("express");
const admin_route = express();

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/adminView");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/brandImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const proStorage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    // console.log("hello");
    // console.log(file)
    cb(null, path.join(__dirname, "../public/productImages")); 
  },
  filename: function (req, file, cb) {
    // console.log("hai");
    // console.log(file.originalname)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const proUpload = multer({ storage: proStorage });

const adminController = require("../controller/adminController");
const CategoryControle = require("../controller/categoryController");
const productControle = require("../controller/productController");
const brandControle = require("../controller/brandController");
const isAdmin = require("../middleware/adminAuth");
const orderController=require("../controller/orderController")
const couponController=require("../controller/couponController")

admin_route.get("/", adminController.adminLogin);
admin_route.post("/login", adminController.verifyAdmin);
admin_route.get("/logout", isAdmin, adminController.logout);
admin_route.get("/dashboard", isAdmin, adminController.loadDash);
admin_route.get("/sellers", isAdmin, adminController.loadSellers);

admin_route.post("/block-user", isAdmin, adminController.blockUser);

//  admin_route.get('/block-user',adminController.unblockUser)
// admin_route.get("/unblock-user", isAdmin, adminController.unblockUser);

//*********************************Category Controller*********************** */
admin_route.get("/category", isAdmin, CategoryControle.loadCategory);
admin_route.get("/addCategory", isAdmin, CategoryControle.loadCreate);
admin_route.post("/addCategoryPost", isAdmin, CategoryControle.addCate);

admin_route.post("/cat-list", isAdmin, CategoryControle.listCat);
admin_route.get("/cat-edit", isAdmin, CategoryControle.loadEdit);

admin_route.post("/editCategoryPost", isAdmin, CategoryControle.editCat);

admin_route.post("/cat-cancel", isAdmin, CategoryControle.cancelCat);

admin_route.get("/catagoryOffer",isAdmin,CategoryControle.loadCategoryOffer)

admin_route.get("/addOffer",isAdmin,CategoryControle.addOfferLoad)

admin_route.post("/addOfferPost",isAdmin,CategoryControle.addOffer)

admin_route.post("/deleteOffer",isAdmin,CategoryControle.deleteOffer)

/*******************************************Product Route***************************** */

admin_route.get("/product", isAdmin, productControle.loadProduct);

admin_route.get("/addProduct", isAdmin, productControle.loadAdd);

admin_route.post(
  "/addProduct",
  isAdmin,
  proUpload.array("proImage", 5),
  productControle.addProduct
);

admin_route.get("/edit-pro", isAdmin, productControle.loadEdit);

admin_route.post(
  "/edit-pro",
  isAdmin,
  proUpload.array("proImage", 5),
  productControle.editPro
);

admin_route.get("/block-pro", isAdmin, productControle.blockPro);

// admin_route.get("/image-delete");

// admin_route.get("/productDetails",isAdmin)

admin_route.post("/editImage",isAdmin,productControle.imageEdit)
admin_route.post("/single-image",isAdmin,proUpload.single("proImage"),productControle.singleImage)

/***************************************Brand Route**************************** */

admin_route.get("/brand",isAdmin, brandControle.loadBrand);
admin_route.get("/add-brand",isAdmin, brandControle.loadAdd);

admin_route.post("/add-brand",isAdmin, upload.single("image"), brandControle.addBrand);
admin_route.get("/brand-list",isAdmin, brandControle.listBrand);
admin_route.get("/brand-edit",isAdmin, brandControle.editload);



//*************************************************Order Route***********************8 */
 

admin_route.get("/order",isAdmin,orderController.loadOrder)
admin_route.get("/order-Detail",isAdmin,orderController.loadOrderDetail)
admin_route.post("/orderSave",isAdmin,orderController.saveOrder)


  //******************************************Coupon********************************* */
admin_route.get("/coupon",isAdmin,couponController.loadCouponPage)
admin_route.get("/addCoupon",isAdmin,couponController.addCouponLoad)
admin_route.post("/addCoupon",isAdmin,couponController.addCoupon)
admin_route.post("/coupon-block",isAdmin,couponController.blockCoupon)
admin_route.get("/coupon-edit",isAdmin,couponController.editpageLoad)
admin_route.post("/editCoupon",isAdmin,couponController.editCoupon)


//*****************************************************Sales***************** */


admin_route.get("/sales",isAdmin,adminController.loadSales)
admin_route.get("/salesDate",isAdmin,adminController.dateFilter)
admin_route.get("/Date",isAdmin,adminController.sortDate)




module.exports = admin_route;