const { Product } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const createProduct = async (req, res) => {
  try {
    let { body } = req;
    let product = new Product(body);
    product.user = req.userId;
    let data = await product.save();
    if (data) {
      return successResponseWithData(res, "Product created successfully", data);
    } else {
      return validationErrorWithData(res, "Error in creating product", data);
    }
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({ user: req.userId }).populate("user");
    return successResponseWithData(res, "Products List", products);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getProductDetails = async (req, res) => {
  try {
    let product = await Product.findById(req.params.productId).populate("user");
    return successResponseWithData(res, "Product Details", product);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updateProductDetails = async (req, res) => {
  try {
    let {
      body,
      params: { productId: _id },
    } = req;

    let data = await Product.findOneAndUpdate({ _id }, body, {
      runValidators: true,
      new: true,
    });

    return successResponseWithData(res, "Update Successful", data);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let product = await Product.deleteOne({ _id: req.body.productId });
    return successResponseWithData(res, "Product deleted", product);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProductDetails,
  deleteProduct,
};
