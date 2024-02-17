const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    items: [
      {
        productsId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          require: true,
        },
        subTotal: {
          type: Number,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
    total: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("cart", cartSchema);
