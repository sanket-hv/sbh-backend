const mongoose = require("../config/db");

// SCHEMA
const PartySchema = mongoose.Schema(
  {
    partyName: {
      type: String,
      required: [true, "Partyname is required"],
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile No is must required"],
      unique: true,
    },
    gstNo: {
      type: String,
      required: [true, "GSTNo is must required"],
      unique: true,
    },
    panNo: {
      type: String,
      required: [true, "Pan No is must required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is must required"],
    },
    city: {
      type: String,
      required: [true, "City is must required"],
    },
    state: {
      type: String,
      required: [true, "State is must required"],
    },
    discount: Number,
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

const Party = new mongoose.model("Party", PartySchema);
module.exports = Party;
