const mongoose = require("../config/db");

// Schema
const SaleSchema = new mongoose.Schema(
  {
    salesNo: Number,
    salesDate: Date,
    totalQty: Number,
    totalAmt: Number,
    disPer: Number,
    disAmt: Number,
    sgstPer: Number,
    sgstAmt: Number,
    cgstPer: Number,
    cgstAmt: Number,
    igstPer: Number,
    igstAmt: Number,
    netAmt: Number,
    roundAmt: Number,
    challanNo: {
      type: String,
      required: [true, "Challan No. is required"],
    },
    remarks: String,
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Party is required"],
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

const Sale = new mongoose.model("Sale", SaleSchema);

module.exports = Sale;
