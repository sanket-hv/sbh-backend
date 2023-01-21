const { User, UserActivation } = require("../../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../../helpers/apiResponses");

const mongoose = require("../../config/db");

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

    if (data.userType == "admin") {
      await session.commitTransaction();
      return successResponseWithData(res, "User Created", data);
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
      return validationErrorWithData(res, "Error while creating user");
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
    let users = await User.find({ userType: "user", deletedAt: null });
    return successResponseWithData(res, "Users List", users);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    let { user } = req.body;
    let data = await User.findById(user);

    let history = await UserActivation.find({ user }, null, {
      $sort: { updatedAt: -1 },
    });

    successResponseWithData(res, "User Details", { data, history });
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    let { user } = req.body;

    if (!user) {
      return validationErrorWithData(res, "Enter User");
    }

    await User.updateOne({ _id: user }, { deletedAt: new Date(Date.now()) });

    await UserActivation.updateMany(
      { user },
      { deletedAt: new Date(Date.now()) }
    );

    successResponseWithData(res, "User Deleted Successfully", user);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = { createUser, getUsers, getUserDetails, deleteUser };
