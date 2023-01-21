const mongoose = require("../config/db");

// Schema
const SalesDetailSchema = new mongoose.Schema(
  {
    /* product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    }, */
    product: {
      type: String,
      required: [true, "Product is required"],
    },
    rate: Number,
    qty: Number,
    amt: Number,
    sales: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: [true, "Sales is required"],
    },
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

const SalesDetail = new mongoose.model("SalesDetail", SalesDetailSchema);

module.exports = SalesDetail;
