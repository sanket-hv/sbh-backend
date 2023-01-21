const mongoose = require("../config/db");

// SCHEMA
const AccYearSchema = mongoose.Schema(
  {
    startDate: String,
    endDate: String,
    accYear: {
      type: String,
      unique: true,
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

const AccYear = new mongoose.model("AccYear", AccYearSchema);

module.exports = AccYear;
