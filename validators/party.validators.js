const { body } = require("express-validator");

const partyCreateValidator = [
  body("partyName").isLength({ min: 3 }).withMessage("Party Name is required."),
  body("mobileNo")
    // .isLength({ min: 1 })
    // .withMessage("Mobile No. is required.")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Mobile No."),
  body("gstNo").isLength({ min: 1 }).withMessage("GST No. is required."),
  body("panNo").isLength({ min: 1 }).withMessage("PAN No. is required."),
  body("address").isLength({ min: 1 }).withMessage("Address is required."),
  body("city").isLength({ min: 1 }).withMessage("City is required."),
  body("state").isLength({ min: 1 }).withMessage("State is required."),
];

module.exports = { partyCreateValidator };
