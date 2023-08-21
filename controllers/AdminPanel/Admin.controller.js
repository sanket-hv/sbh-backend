const { User, UserActivation } = require("../../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../../helpers/apiResponses");

const getAdminDetails = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    successResponseWithData(res, "Admin Details", user);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const data = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      runValidators: true,
      new: true,
    });

    successResponseWithData(res, "Admin Updated Successfully", data);
  } catch (error) {
    if (error.code === 11000 && error.name == "MongoError") {
      return ErrorResponse(
        res,
        constants[Object.keys(error.keyValue)] + " is already present."
      );
    }
    return ErrorResponse(res, error.message);
  }
};

module.exports = { getAdminDetails, updateAdmin };
