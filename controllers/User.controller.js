const { User, UserActivation } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const mongoose = require("../config/db");

const moment = require("moment");

const constants = {
  mobileNo: "Mobile No.",
  gstNo: "GST No.",
  panNo: "PAN No.",
};

const createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { body } = req;
    let user = new User(body);
    let data = await user.save({ session });

    if (!data) {
      await session.abortTransaction();
      return validationErrorWithData(res, "Error in creating new user");
    }

    let startDate = new Date(new Date().setHours(0, 0, 0, 0)),
      endDate = new Date(
        moment(new Date().setHours(0, 0, 0, 0)).add(30, "days")
      );

    let obj = {
      user: data._id,
      startDate,
      endDate,
      planDuration: "30 Days",
      amount: 0,
    };

    let userActivation = new UserActivation(obj);
    userActivation = await userActivation.save({ session });

    if (!userActivation) {
      await session.abortTransaction();
      return validationErrorWithData(res, "Error while registering user");
    }

    await session.commitTransaction();
    return successResponseWithData(res, "User Created", data);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    if (err.code === 11000 && err.name == "MongoError") {
      return ErrorResponse(
        res,
        constants[Object.keys(err.keyValue)] + " is already present."
      );
    }
    return ErrorResponse(res, err.message);
  } finally {
    session.endSession();
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    return successResponseWithData(res, "Users List", users);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    successResponseWithData(res, "User Details", user);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const data = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      runValidators: true,
      new: true,
    });

    successResponseWithData(res, "User Updated Successfully", data);
  } catch (error) {
    console.error(error);
    if (err.code === 11000 && err.name == "MongoError") {
      return ErrorResponse(
        res,
        constants[Object.keys(err.keyValue)] + " is already present."
      );
    }
    return ErrorResponse(res, error.message);
  }
};

module.exports = { createUser, getUsers, getUserDetails, updateUser };
