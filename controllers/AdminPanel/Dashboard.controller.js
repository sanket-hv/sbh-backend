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

const activateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { user, planDuration, amount } = req.body;

    if (!user || !planDuration || !amount) {
      return notFoundResponse(
        res,
        "Enter all fields [ 'user', 'planDuration', 'amount' ]"
      );
    }

    let userData = await User.findOne({ _id: user }, "-_id status");

    if (!userData) return notFoundResponse(res, "User not found");

    if (userData.status)
      return validationErrorWithData(res, "User already active");

    let [quantity, unit] = planDuration.split(" ");
    let startDate = new Date(new Date().setHours(0, 0, 0, 0)),
      endDate = new Date(
        moment(new Date().setHours(0, 0, 0, 0)).add(
          quantity,
          unit.toLowerCase()
        )
      );

    let obj = {
      user,
      startDate,
      endDate,
      planDuration,
      amount,
    };

    let data = new UserActivation(obj);
    data = await data.save({ session });

    if (!data) {
      await session.abortTransaction();
      return validationErrorWithData(res, "Error in user activation");
    }

    await User.updateOne(
      { _id: user },
      { status: true, reason: "" },
      { session }
    );

    await session.commitTransaction();
    return successResponseWithData(res, "User Activated", data);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return ErrorResponse(res, err.message);
  } finally {
    session.endSession();
  }
};

const deActivateUser = async (req, res) => {
  try {
    let { user, reason } = req.body;

    if (!user || !reason) {
      return notFoundResponse(res, "Enter all fields [ 'user', 'reason' ]");
    }

    let userData = await User.findOne({ _id: user }, "-_id status");

    if (!userData) return notFoundResponse(res, "User not found");

    if (!userData.status)
      return validationErrorWithData(res, "User already blocked");

    let data = await User.updateOne(
      { _id: user },
      { status: false, reason },
      { new: true }
    );

    return successResponseWithData(res, "User Blocked", data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { activateUser, deActivateUser };
