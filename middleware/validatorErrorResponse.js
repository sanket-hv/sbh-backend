const { validationResult } = require("express-validator");
const { ErrorResponse } = require("../helpers/apiResponses");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) =>
  `${location}[${param}] : ${msg}`;

const validatorErrorResponse = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors);
  if (!errors.isEmpty()) {
    return ErrorResponse(res, errors.array().join(", "));
  } else {
    return next();
  }
};

module.exports = { validatorErrorResponse };
