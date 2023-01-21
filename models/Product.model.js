const mongoose = require("../config/db");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    rate: {
      type: Number,
      default: 0,
    },
    /* sales: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: [true, "Sales is required"],
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Party is required"],
    }, */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = new mongoose.model("Product", ProductSchema);
module.exports = Product;
