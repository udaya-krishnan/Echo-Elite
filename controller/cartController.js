const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const Order = require("../model/orderModel");
const generateOrder = require("../controller/otpGenrate");
const generateDate=require("../controller/dateGenrator")

const loadCart = async (req, res) => {
  try {
    const id = req.body.id;
    const price = req.body.proPrice;

    const splitPrice = price.split("");

    const slice = splitPrice.shift();

    const priceOFF = splitPrice.join("");

    console.log(priceOFF);

    console.log(req.session.email);
    const userData = await User.findOne({ email: req.session.email });

    const userCart = await Cart.findOne({ userId: userData._id });

    if (userCart) {
      const proCart = await Cart.findOne({ "items.productsId": id });
      if (proCart) {
        res.json({ status: "viewCart" });
      } else {
        const updateCart = await Cart.findOneAndUpdate(
          { userId: userData._id },
          {
            $push: {
              items: {
                productsId: id,
                subTotal: priceOFF,
                quantity: 1,
              },
            },
            $inc: {
              total: priceOFF,
            },
          }
        );
      }
    } else {
      const carData = new Cart({
        userId: userData._id,
        items: [
          {
            productsId: id,
            subTotal: priceOFF,
            quantity: 1,
          },
        ],
        total: priceOFF,
      });

      const cart = carData.save();
    }

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const loadCartpage = async (req, res) => {
  try {
    const email = req.session.email;
    // const userData = req.
    const userData = await User.findOne({ email: email });

    const cartData = await Cart.findOne({ userId: userData._id });
    const proData = [];

    if (cartData) {

      const arr = [];

      for (let i = 0; i < cartData.items.length; i++) {
        arr.push(cartData.items[i].productsId.toString());
      }
      // console.log(arr);
    
      for (let i = 0; i < arr.length; i++) {
        proData.push(await Product.findById({ _id: arr[i] }));
      }

      console.log(proData);

     
    }

    console.log(proData,cartData)
    res.render("cart", { proData, cartData });

    // console.log(cartData)
  } catch (error) {
    console.log(error.message);
  }
};

const addCart = async (req, res) => {
  try {
    // console.log(req.body);
    const { price, proId, index, subTotal, qty } = req.body;
    //  console.log(req.session.userId)
    //  console.log("hello             "+proId);
    const quantity = parseInt(qty);
    console.log(quantity);
    const proIdString = proId.toString();

    const proData = await Product.findById({ _id: proIdString });

    console.log(proData);

    const stock = proData.stock;

    if (stock > quantity) {
      if (quantity < 10) {
        const addPrice = await Cart.findOneAndUpdate(
          { userId: req.session.userId, "items.productsId": proIdString },
          {
            $inc: {
              "items.$.price": price,
              "items.$.quantity": 1,
              "items.$.subTotal": price,
              total: price,
            },
          }
        );

        const findCart = await Cart.findOne({ userId: req.session.userId });

        res.json({ status: true, total: findCart.total });
      } else {
        res.json({ status: "minimum" });
      }
    } else {
      console.log("out os stocccccccccccck");
      res.json({ status: "stock" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const decrement = async (req, res) => {
  try {
    const { price, proId, index, subTotal, qty } = req.body;
    const proIdString = proId.toString();
    const quantity = parseInt(qty);

    if (quantity > 1) {
      const addPrice = await Cart.findOneAndUpdate(
        { userId: req.session.userId, "items.productsId": proIdString },
        {
          $inc: {
            "items.$.price": -price,
            "items.$.quantity": -1,
            "items.$.subTotal": -price,
            total: -price,
          },
        }
      );

      const findCart = await Cart.findOne({ userId: req.session.userId });

      res.json({ status: true, total: findCart.total });
    } else {
      res.json({ status: "minimum" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeCart = async (req, res) => {
  try {
    const id = req.body.id;
    const sbt = req.body.sbt;

    const delePro = await Cart.findOneAndUpdate(
      { userId: req.session.userId },
      {
        $pull: { items: { productsId: id } },
        $inc: { total: -sbt },
      }
    );
    const findPro = await Cart.findOne({ userId: req.session.userId });

    res.json({ status: true, total: findPro.total });
    // console.log(id)
  } catch (error) {
    console.log(error.message);
  }
};

const loadCheckOut = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.session.email });

    const cartData = await Cart.findOne({ userId: userData._id });
    const quantity = [];

    for (let i = 0; i < cartData.items.length; i++) {
      quantity.push(cartData.items[i].quantity);
    }

    const proId = [];
    for (let i = 0; i < cartData.items.length; i++) {
      proId.push(cartData.items[i].productsId);
    }
    const proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    for (let i = 0; i < proData.length; i++) {
      for (let j = 0; j < quantity.length; j++) {
        if (proData[i].stock < quantity[i]) {
          res.json({ status: "checked" });
        }
      }
    }

    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const loadCheckOutPage = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.session.email });

    const cartData = await Cart.findOne({ userId: userData._id });

    const proId = [];

    for (let i = 0; i < cartData.items.length; i++) {
      proId.push(cartData.items[i].productsId);
    }

    const proData = [];

    for (let i = 0; i < proId.length; i++) {
      proData.push(await Product.findById({ _id: proId[i] }));
    }

    console.log(proData);

    const cartItems = cartData.items;

    const address = await Address.find({ userId: userData._id });

    res.render("checkOut", { proData, cartItems, cartData, address });
  } catch (error) {}
};

const addOrder = async (req, res) => {
  try {
    const { addressId, cartid, checkedOption } = req.body;

    console.log(addressId, cartid, checkedOption);

    const userData = await User.findOne({ email: req.session.email });

    const cartData = await Cart.findOne({ userId: userData._id });

    const proData = [];

    for (let i = 0; i < cartData.items.length; i++) {
      proData.push(cartData.items[i]);
    }
    console.log(proData);

  const quantity=[]


    for(let i=0;i<proData.length;i++){
      quantity.push(proData[i].quantity)
    }

    const proId=[]
    
    for(let i=0;i<proData.length;i++){
      proId.push(proData[i].productsId)
    }

    for(let i=0;i<proId.length;i++){

      const product=await Product.findByIdAndUpdate({_id:proId[i]},
        {
          $inc:{
            stock:-quantity[i]
          }
        })
    }

    console.log(" quantityyyyyyyyyyyyyyyyyy"+quantity)

    const orderNum = generateOrder.generateOrder();
    console.log(orderNum);

    const addressData = await Address.findOne({ _id: addressId });

    console.log(addressData);
    const date=generateDate()

    const orderData = new Order({
      userId: userData._id,
      userEmail:userData.email,
      orderNumber: orderNum,
      items: proData,
      totalAmount: cartData.total,
      orderType: checkedOption,
      orderDate:date,
      status: "Ordered",
      shippingAddress: addressData,
    });

    console.log(proData);

    orderData.save();

    res.json({ status: true });

    const deleteCart = await Cart.findByIdAndDelete({ _id: cartData._id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadCart,
  loadCartpage,
  addCart,
  decrement,
  removeCart,
  loadCheckOut,
  loadCheckOutPage,
  addOrder,
};
