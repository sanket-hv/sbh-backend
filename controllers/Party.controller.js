const { Party } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const constants = {
  mobileNo: "Mobile No.",
  gstNo: "GST No.",
  panNo: "PAN No.",
};

const createParty = async (req, res) => {
  try {
    let { body } = req;
    let party = new Party(body);
    party.user = req.userId;
    let data = await party.save();
    if (data) {
      return successResponseWithData(res, "Party created successfully", data);
    } else {
      return validationErrorWithData(res, "Error in creating party", data);
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.name == "MongoError") {
      return ErrorResponse(
        res,
        constants[Object.keys(err.keyValue)] + " is already present."
      );
    }
    return ErrorResponse(res, err.message);
  }
};

const getAllParties = async (req, res) => {
  try {
    let parties = await Party.find({ user: req.userId }).populate("user");
    return successResponseWithData(res, "Parties List", parties);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getPartyDetails = async (req, res) => {
  try {
    let party = await Party.findById(req.params.partyId).populate("user");
    return successResponseWithData(res, "Party Details", party);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const updatePartyDetails = async (req, res) => {
  try {
    let {
      body,
      params: { partyId: _id },
    } = req;

    let data = await Party.findOneAndUpdate({ _id }, body, {
      runValidators: true,
      new: true,
    });

    return successResponseWithData(res, "Update Successful", data);
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.name == "MongoError") {
      return ErrorResponse(
        res,
        constants[Object.keys(err.keyValue)] + " is already present."
      );
    }
    return ErrorResponse(res, err.message);
  }
};

const validatePartyDetails = async (req, res) => {
  try {
    let { field, value } = req.body;
    let result = await Party.countDocuments({ [field]: value });
    field == "gstNo"
      ? (field = "GST No.")
      : field == "mobileNo"
      ? (field = "Mobile No.")
      : field == "panNo"
      ? (field = "PAN No.")
      : true;
    if (result) {
      return successResponse(res, `${field} is already present.`);
    } else {
      return successResponse(res, `${field} validated successfully.`, true);
    }
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const deleteParty = async (req, res) => {
  try {
    let party = await Party.deleteOne({ _id: req.body.partyId });
    return successResponseWithData(res, "Party deleted", party);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = {
  createParty,
  getAllParties,
  getPartyDetails,
  updatePartyDetails,
  validatePartyDetails,
  deleteParty,
};
