const mongoose = require("../config/db");

// SCHEMA
const UserActivationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Plan Start Date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Plan End Date is required"],
    },
    planDuration: {
      type: String,
      required: [true, "Enter plan duration"],
    },
    amount: {
      type: Number,
      required: [true, "Plan Charges are required"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserActivation = new mongoose.model(
  "UserActivation",
  UserActivationSchema
);
module.exports = UserActivation;
