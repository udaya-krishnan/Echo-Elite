const User = require("../model/userModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const Coupon = require("../model/CouponModel");
const Chart = require("chart.js");
const Brand=require("../model/brandModel")
// const bcrypt=require('bcrypt')

const adminEmail = process.env.ADMINEMAIL;

const adminPass = process.env.ADMINPASS;

const adminLogin = async (req, res) => {
  try {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("adminLogin");
    }
    // console.log('hello')
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdmin = async (req, res) => {
  try {
    // console.log(req.body.email)
    const email = req.body.email;
    const password = req.body.password;

    if (email == adminEmail) {
      if (password == adminPass) {
        req.session.admin = email;
        res.json({ status: true });
      } else {
        res.json({ status: "passErr" });
      }
    } else {
      res.json({ status: "emailErr" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDash = async (req, res) => {
  try {
    const yValues = [0, 0, 0, 0, 0, 0, 0];
    const order = await Order.find({
      status: { $nin: ["Ordered","Processing", "Canceled", "Shipped"] },
    });
    // console.log("ORDERS START");
    // console.log(order);
    // console.log("ORDERS END");


    for (let i = 0; i < order.length; i++) {
      var date = order[i].createdAt;
      // console.log(date + "dddddddddddddddddddddddddddddddddddddd");
      const value = date.getDay()
      yValues[value] += order[i].totalAmount;
    }

    const allData = await Category.find({});

    const sales = [];

    for (let i = 0; i < allData.length; i++) {
      sales.push(0);
    }


    // console.log("SALES START");
    // console.log(sales);
    // console.log("SALES END");


    const allName = allData.map((x) => x.name);
    const allId = allData.map((x) => x._id);

    // console.log(allName);
    let productId = [];
    let quantity = [];

    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order[i].items.length; j++) {
        productId.push(order[i].items[j].productsId);
        quantity.push(order[i].items[j].quantity);
      }
    }

    // console.log("QUANTITY");
    // console.log(quantity);
    // console.log(productId);
    // console.log("PRODUCT");


    const productData = [];
    for (let i = 0; i < productId.length; i++) {
      productData.push(await Product.findById({ _id: productId[i] }));
    }

    //  console.log(productData);

    for (let i = 0; i < productData.length; i++) {
      for (let j = 0; j < allId.length; j++) {
      
        if (allId[j] == productData[i].category.toString()) {
          console.log(quantity[i]);
          sales[j] += quantity[i];
        }
      }
    }

    const allBrand=await Brand.find({})

    const brandName=allBrand.map((x)=>x.name)

    const topBrand=[]

    for(let i=0;i<brandName.length;i++){
      topBrand.push({count:0,brand:allBrand[i]})
    }
    

    for (let i = 0; i < productData.length; i++) {
      for (let j = 0; j < brandName.length; j++) {
      
        if (brandName[j] == productData[i].brand) {
          // console.log(quantity[i]);
          topBrand[j].count += quantity[i];
        
        }
      }
    }

    // console.log(topBrand)

    topBrand.sort((a, b) => b.count - a.count);





    //*******************************************************************8 */
      console.log("ATRAT")
      console.log("ATRAT")

      console.log(order)


      const month=await Order.aggregate([
        {
          $project: {
            _id: { $dateToString: { format: "%m-%Y", date: "$createdAt" } },
            totalAmount: 1
          }
        },
        {
          $group: {
            _id: "$_id",
            totalEarnings: { $sum: "$totalAmount" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      
      console.log("ATRAT")

      console.log(month)

      let array=[0,0,0,0,0,0,0,0,0,0,0,0]

      let months=["01-2024","02-2024","03-2024","04-2024","05-2024","06-2024","07-2024","08-2024","09-2024","10-2024","11-2024","12-2024"]


      for(let i=0;i<array.length;i++){
        for(let j=0;j<month.length;j++){
          if(month[j]._id==months[i]){
            array[i]+=month[j].totalEarnings
          }
        }
      }

      console.log(array)
      console.log("ATRAT")

    


    //************************************************************8 */








    let topProduct = [];




const productQuantityMap = new Map();

// Iterate over each order and update the quantity sold for each product ID
order.forEach(order => {
  order.items.forEach(item => {
    const productId = item.productsId.valueOf();
    const quantity = item.quantity;
    productQuantityMap.set(productId, (productQuantityMap.get(productId) || 0) + quantity);
  });
});
console.log("start");
console.log(productQuantityMap)
console.log("ende");

// Convert the map to an array of objects
const productQuantityArray = [...productQuantityMap.entries()].map(([productId, quantity]) => ({ productId, quantity }));

productQuantityArray.sort((a, b) => b.quantity - a.quantity);

console.log(productQuantityArray);



    for(let key in productQuantityArray){
     
      topProduct.push(await Product.findById({_id:productQuantityArray[key].productId}))
    }

    console.log(topProduct)




    const orderData = await Order.find({ status: "Delivered" });
    let sum = 0;
    for (let i = 0; i < orderData.length; i++) {
      sum = sum + orderData[i].totalAmount;
    }
    const product = await Product.find({});
    const category = await Category.find({});
    // const order = await Order.find({
    //   status: { $nin: ["Ordered", "Canceled", "Shipped"] },
    // });
    // Aggregate pipeline to calculate monthly earnings from delivered orders
    if (order.length > 0) {
      const month = await Order.aggregate([
        // Match orders with status "Delivered"
        { $match: { status: "Delivered" } },
        // Convert orderDate string to ISODate
        {
          $addFields: {
            orderDate: {
              $dateFromString: { dateString: "$orderDate", format: "%d-%m-%Y" },
            },
          },
        },
        // Extract year and month from orderDate
        {
          $addFields: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
        },
        // Group by year and month, calculate total earnings for each month
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalEarnings: { $sum: "$totalAmount" },
          },
        },
        // Sort by year and month
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const proLength = product.length;
      const catLength = category.length;
      const orderLength = order.length;
      res.render("adminDash", {
        sum,
        proLength,
        catLength,
        orderLength,
        month,
        yValues,
        allName,
        sales,
        productData,
        topProduct,
        productQuantityArray,
        topBrand,
        array
        // idCountArray
        // productSales,
      });
      //  console.log("hhhhhhhhhheeeeeeelo"+month)
    } else {
      const proLength = product.length;
      const catLength = category.length;
      const orderLength = order.length;
      const month = null;
      res.render("adminDash", {
        sum,
        proLength,
        catLength,
        orderLength,
        month,
        yValues,
        allName,
        sales,
        productData,
        topProduct,
        productQuantityArray,
        topBrand,
        array
        // idCountArray
        // productSales,
      });
    }

    //  console.log(month[0].totalEarnings);
  } catch (error) {
    console.log(error.message);
  }
};

const loadSellers = async (req, res) => {
  try {
    const userData = await User.find({});

    // console.log(userData)
    res.render("adminSellers", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const id = req.body.id;

    console.log("inssssssssssssssssssssssssssssssssss");

    const findUser = await User.findById({ _id: id });

    if (findUser.is_blocked == false) {
      const userData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_blocked: true,
          },
        }
      );
      res.json({ status: "blocked" });
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_blocked: false,
          },
        }
      );

      res.json({ status: "unblocked" });
    }

    //    res.redirect('/admin/sellers')
  } catch (error) {
    console.log(error.message);
  }
};

//  const unblockUser=async(req,res)=>{
//    try {
//       const id=req.query.id

//       const findUser=await User.findById({_id:id})

//      if(findUser.is_blocked==true){
//        const userData=await User.findByIdAndUpdate({_id:id},
//        {$set:{
//          is_blocked:false
//       }})

//    }
//    res.redirect('/admin/sellers')

//    } catch (error) {
//       console.log(error.message)
//    }
//  }

const logout = async (req, res) => {
  try {
    delete req.session.admin;
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

const loadSales = async (req, res) => {
  try {
    const order = await Order.find({
      status: { $nin: ["Ordered", "Canceled", "Shipped"] },
    });
    //  let couponid=[]
    //  for(let i=0;i<order.length;i++){
    //    if(order[i].coupon){
    //       couponid.push(order[i].coupon)
    //    }
    //  }
    //  const couponData=[]

    //  for(let i=0;i<couponid.length;i++){
    //    couponData.push(await Coupon.find({couponCode:couponid[i]}))
    //  }

    //  console.log(couponData)
    //  console.log(order)

    res.render("adminSales", { order });
  } catch (error) {
    console.log(error.message);
  }
};

const dateFilter = async (req, res) => {
  try {
    const date = req.query.value;
    const date2 = req.query.value1;
   
    const firstDate=new Date(date)
    const secondDate=new Date(date2)
    // console.log(rotatedDate)

    console.log(firstDate,'                            ',secondDate)

    const order = await Order.find({
      status: { $nin: ["Ordered", "Canceled", "Shipped"] },
      createdAt:{
        $gte:firstDate,
        $lte:secondDate 
      }
    });

    // console.log(order)

    res.render("adminSales", { order });
  } catch (error) {
    console.log(error.message);
  }
};

const sortDate = async (req, res) => {
  try {
    const sort = req.query.value;
    let orderDateQuery = {};

    // Get the current date
    const currentDate = new Date();

    // Parse the current date into the format "8-3-2024"
    const currentDateString = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;

    // Depending on the sort value, adjust the orderDateQuery accordingly
    if (sort === "Day") {
      // For Day sorting, query orders for the current day
      orderDateQuery = currentDateString;
    } else if (sort === "Week") {
      // For Week sorting, query orders for the current week
      // Calculate the start and end dates of the week
      const firstDayOfWeek = new Date(currentDate);
      firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week
      const lastDayOfWeek = new Date(currentDate);
      lastDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6); // End of the current week
      const firstDayOfWeekString = `${firstDayOfWeek.getDate()}-${
        firstDayOfWeek.getMonth() + 1
      }-${firstDayOfWeek.getFullYear()}`;
      const lastDayOfWeekString = `${lastDayOfWeek.getDate()}-${
        lastDayOfWeek.getMonth() + 1
      }-${lastDayOfWeek.getFullYear()}`;
      orderDateQuery = {
        $gte: firstDayOfWeekString,
        $lte: lastDayOfWeekString,
      };
    } else if (sort === "Month") {
      // For Month sorting, query orders for the current month
      orderDateQuery = {
        $regex: `-${currentDate.getMonth() + 1}-`,
      };
    } else if (sort === "Year") {
      // For Year sorting, query orders for the current year
      orderDateQuery = {
        $regex: `-${currentDate.getFullYear()}$`,
      };
    }

    console.log(orderDateQuery);

    // Query orders based on status and order date
    const order = await Order.find({
      status: { $nin: ["Ordered", "Canceled", "Shipped"] },
      orderDate: orderDateQuery,
    });

    res.render("adminSales", { order });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminLogin,
  verifyAdmin,
  loadDash,
  loadSellers,
  blockUser,
  logout,
  loadSales,
  dateFilter,
  sortDate,
};
