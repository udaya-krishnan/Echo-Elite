const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");

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

    

    const cartData = await Cart.findOne({userId:userData._id});

    // console.log(cartData)

    const arr=[]

    for(let i=0;i<cartData.items.length;i++){
        arr.push(cartData.items[i].productsId.toString())
    }
    // console.log(arr);
    const proData=[]
    for(let i=0;i<arr.length;i++){
        proData.push(await Product.findById({_id:arr[i]}) )   
        
    }


    res.render("cart",{proData,cartData});
  } catch (error) {
    console.log(error.message);
  }
};

const addCart=async(req,res)=>{
    try {
        // console.log(req.body);
       const {price,proId,index,subTotal,qty}= req.body
        //  console.log(req.session.userId)
        //  console.log("hello             "+proId);
        const quantity=parseInt(qty)
        console.log(quantity)
          const proIdString=proId.toString()

          const proData=await Product.findById({_id:proIdString})

          console.log(proData);

           const stock=proData.stock

          if(stock>quantity){
            
      if(quantity<10){
       const addPrice=await Cart.findOneAndUpdate({userId:req.session.userId,"items.productsId":proIdString},
       {
        $inc:{"items.$.price":price,"items.$.quantity":1,"items.$.subTotal":price,"total":price}
       })

       const findCart=await Cart.findOne({userId:req.session.userId})

    
       res.json({status:true,total:findCart.total})
    }else{
        res.json({status:"minimum"})
    }
  }else{

    console.log("out os stocccccccccccck");
    res.json({status:"stock"})
  }

      
    } catch (error) {
        console.log(error.message);
    }
}

const decrement=async(req,res)=>{
    try {
        const {price,proId,index,subTotal,qty}= req.body
        const proIdString=proId.toString()
        const quantity=parseInt(qty)

        
        

        if(quantity>1){
        const addPrice=await Cart.findOneAndUpdate({userId:req.session.userId,"items.productsId":proIdString},
       {
        $inc:{"items.$.price":-price,"items.$.quantity":-1,"items.$.subTotal":-price,"total":-price}
       })

       const findCart=await Cart.findOne({userId:req.session.userId})

       res.json({status:true,total:findCart.total})
    }else{
        res.json({status:"minimum"})
    }

        
    } catch (error) {
       console.log(error.message) 
    }
}


const removeCart=async(req,res)=>{
    try {
        const id=req.body.id
        const sbt=req.body.sbt
        

        
        const delePro=await Cart.findOneAndUpdate({userId:req.session.userId},{
            $pull:{ items:{productsId:id}},
            $inc:{"total":-sbt}
        })
        const findPro=await Cart.findOne({userId:req.session.userId})

          res.json({status:true,total:findPro.total})
        // console.log(id)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
  loadCart,
  loadCartpage,
  addCart,
  decrement,
  removeCart
};