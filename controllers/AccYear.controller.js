const { AccYear } = require("../models");
const {
  ErrorResponse,
  successResponseWithData,
} = require("../helpers/apiResponses");
const moment = require("moment");

const getAllAccYears = async (req, res) => {
  try {
    let data = await AccYear.find({ deletedAt: null }, "", {
      sort: { createdAt: -1 },
    });

    return successResponseWithData(res, "Accounting Years", data);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const addNewAccYear = async (req, res) => {
  try {
    let startDate = moment().startOf("month").format("DD-MM-YYYY");
    let endDate = moment().startOf("month").add(1, "year").format("DD-MM-YYYY");
    let accYear =
      moment(startDate).format("MMM, YYYY") +
      " - " +
      moment(endDate).format("MMM, YYYY");

    let obj = {
      startDate,
      endDate,
      accYear,
    };

    let newAccYear = new AccYear(obj);
    let saved = await newAccYear.save();

    return saved
      ? successResponseWithData(res, "New Accounting Year Added", saved)
      : ErrorResponse(res, "Error in adding new accounting year", saved);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, error.message);
  }
};

module.exports = { getAllAccYears, addNewAccYear };
