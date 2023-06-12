const { Sales, SalesDetail } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const mongoose = require("../config/db");
const Sale = require("../models/Sales.model");

const getNewSalesNo = async (req, res) => {
  try {
    let data = await Sales.findOne({ user: req.userId }, "-_id salesNo", {
      sort: { createdAt: -1 },
    });
    let salesNo = data ? parseInt(data.salesNo) + 1 || 1 : 1;
    return successResponseWithData(res, "Sales No.", salesNo);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const createSales = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { sales, saleDetails } = req.body;
    let { userId: user } = req;

    if (!!!sales.party) {
      return validationErrorWithData(res, "Please select party");
    }

    sales = new Sales(sales);
    sales.user = user;
    let salesData = await sales.save({ session });

    if (!salesData) {
      await session.abortTransaction();
      return validationErrorWithData(
        res,
        "Error in saving sales entry",
        salesData
      );
    }

    let salesDetails = await saleDetails.map((details) => {
      details = new SalesDetail(details);
      details.user = user;
      details.sales = salesData._id;
      return details;
    });

    let salesDetailsData = await SalesDetail.insertMany(salesDetails, {
      session,
    });

    if (!salesDetailsData) {
      await session.abortTransaction();
      return validationErrorWithData(
        res,
        "Error in saving sales details",
        salesDetailsData
      );
    }

    await session.commitTransaction();
    return successResponseWithData(res, "Sales saved successfully", {
      sales,
      salesDetails,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return ErrorResponse(res, err.message);
  } finally {
    session.endSession();
  }
};

const getAllSales = async (req, res) => {
  try {
    let { string, duration } = req.body;

    if (!duration) {
      return ErrorResponse(res, "Enter duration");
    }

    let query = {
      user: req.userId,
      salesDate: { $gte: duration.startDate, $lte: duration.endDate },
    };

    let sales = await Sales.find(query).populate({
      path: "party",
      select: { _id: 0, partyName: 1, gstNo: 2 },
    });

    if (string)
      sales = await sales.filter(
        (sale) =>
          sale.party.partyName.toLowerCase().search(string.toLowerCase()) >=
            0 || sale.challanNo?.toLowerCase().search(string.toLowerCase()) >= 0
      );

    return successResponseWithData(res, "Sales List", sales);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getSalesDetails = async (req, res) => {
  try {
    let { salesId: _id } = req.body;
    let sales = await Sales.findOne({ _id, user: req.userId })
      .populate("party")
      .populate("user");
    let salesDetails = await SalesDetail.find({
      sales: _id,
      user: req.userId,
    });

    return successResponseWithData(res, "Sales Details", {
      sales,
      salesDetails,
    });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updateSalesDetails = async (req, res) => {
  try {
    // get userId from decoded token & pass the sales and salesDetails object from body
    let {
      userId: user,
      body: { sales, salesDetails },
    } = req;

    // find the sales id from sales object
    let { _id } = sales;

    // delete sales _Id
    delete sales._id;

    // count sales
    let count = await Sales.countDocuments({ _id, user });
    console.log("count", count);
    if (!count) {
      return notFoundResponse(res, "Sales not available");
    }
    // Update Sales with sales details and sales Id
    let updatedSales = await Sales.findOneAndUpdate(
      { _id, user },
      { ...sales },
      { runValidators: true, new: true }
    );

    let updatedSalesDetails = [];

    // check the sales details is available in collection & count salesDetail
    for (let i = 0; i < salesDetails.length; ++i) {
      let details = salesDetails[i];
      let { _id: detailsId } = details;
      delete details._id;
      count = await SalesDetail.countDocuments({
        _id: detailsId,
        sales: _id,
        user,
      });

      console.log("count", count);

      // if count value = 0 then continue.. statement
      if (!count) continue;

      // update salesDetails
      let data = await SalesDetail.findOneAndUpdate(
        {
          _id: detailsId,
          sales: _id,
          user,
        },
        { ...details },
        { runValidators: true, new: true }
      );
      updatedSalesDetails.push(data);
    }
    return successResponseWithData(res, "Sales updated successfully", {
      sales: updatedSales,
      salesDetails: updatedSalesDetails,
    });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updateSalesRoundAmount = async (req, res) => {
  try {
    let { body, query } = req;
    let { _id } = query;

    // update salesDetails
    let data = await Sale.findByIdAndUpdate(
      {
        _id,
      },
      body,
      { new: true, returnDocument: "after" }
    );
    return successResponseWithData(res, "Sales updated successfully", {
      data: data,
    });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const deleteSales = async (req, res) => {
  try {
    let {
      userId: user,
      body: { salesId },
    } = req;

    let sales = await Sales.deleteOne({ _id: salesId, user });
    let salesDetails = await SalesDetail.deleteMany({ sales: salesId, user });
    return successResponseWithData(res, "Sales deleted successfully", {
      sales,
      salesDetails,
    });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const deleteSalesDetailsItem = async (req, res) => {
  try {
    let {
      userId: user,
      body: { salesDetailId: _id, salesId: sales },
    } = req;

    let salesDetails = await SalesDetail.deleteOne({ _id, sales, user });
    return successResponseWithData(
      res,
      "Sales details item deleted successfully",
      salesDetails
    );
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getPartyWiseProducts = async (req, res) => {
  try {
    let { party } = req.body;
    let user = req.userId;
    let sales = await Sales.find({ user, party }, "_id");

    sales = await sales.map((sale) => sale._id);

    let products = await SalesDetail.find(
      {
        user,
        sales: { $in: sales },
      },
      "product"
    );

    let data = [];

    products.forEach((product) => {
      if (!data.includes(product.product)) data.push(product.product);
    });

    // let data = await products.map((product) => product.product);

    return successResponseWithData(res, "Party Wise Products", data);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = {
  getNewSalesNo,
  createSales,
  getAllSales,
  getSalesDetails,
  updateSalesDetails,
  deleteSales,
  deleteSalesDetailsItem,
  getPartyWiseProducts,
  updateSalesRoundAmount,
};
