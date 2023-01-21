const { Party, Sales, Product } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const getDashboardCount = async (req, res) => {
  try {
    let { userId: user } = req;
    let party = await Party.countDocuments({ user });
    let product = await Product.countDocuments({ user });
    let sales = await Sales.countDocuments({ user });
    return successResponseWithData(res, "Total Counts", {
      party,
      product,
      sales,
    });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = {
  getDashboardCount,
};
