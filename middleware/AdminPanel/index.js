const User = require("../../models/User.model");
const apiResponses = require("../../helpers/apiResponses");

const jwt = require("jsonwebtoken");

const jwtKey = "iicapi_trader_access_token";
const jwtExpirySeconds = 86400; //86400 second for 1 day..

const jwtKeyRefresh = "iicapi_trader_refresh_token";
const jwtExpirySecondsRefresh = 31536000; //86400 second for 1 year..

const tokenList = {};

const signIn = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((result) => {
      if (result) {
        const isMatch = result.comparePassword(password, result);
        if (isMatch) {
          if (result.deletedAt) {
            return apiResponses.validationErrorWithData(
              res,
              "User account has been deleted."
            );
          }

          if (result.userType == "user") {
            return apiResponses.unauthorizedResponse(
              res,
              `Invalid Admin Credentials`
            );
          }

          const _token = jwt.sign({ userid: result._id }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
          });

          const refreshToken = jwt.sign({ userid: result._id }, jwtKeyRefresh, {
            algorithm: "HS256",
            expiresIn: jwtExpirySecondsRefresh,
          });

          tokenList[refreshToken] = result._id;
          const data = { _token, refreshToken, userid: result._id };
          apiResponses.successResponseWithData(res, "Login Successfully", data);
        } else {
          apiResponses.successResponse(
            res,
            "Please enter a valid password",
            false
          );
        }
      } else {
        apiResponses.successResponse(
          res,
          "Please enter a valid username",
          false
        );
      }
    })
    .catch((err) => {
      console.log(err.message);
      apiResponses.ErrorResponse(res, err.message);
    });
};

const welcome = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    apiResponses.unauthorizedResponse(res, "First you need to login...");
  } else {
    if (token.startsWith("Bearer ")) {
      var payload;
      try {
        token = token.split(" ")[1];
        payload = jwt.verify(token, jwtKey);

        let user = await User.findById(payload.userid);

        if (user.deletedAt) {
          return apiResponses.validationErrorWithData(
            res,
            "User account has been deleted."
          );
        }

        if (user.userType == "user") {
          return apiResponses.unauthorizedResponse(res, `Invalid Admin Token`);
        }

        req.userId = payload.userid;
        next();
      } catch (e) {
        console.log(e);
        if (e instanceof jwt.JsonWebTokenError) {
          apiResponses.ErrorResponse(res, e.message);
        } else {
          apiResponses.ErrorResponse(res, "Login Again...");
        }
      }
    }
  }
};

const generateToken = async (req, res) => {
  var { userid, mobile } = req.body;
  var token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    var data = {
      error: true,
      message: "You need to login first...",
    };
    return res.status(200).json(data);
  } else {
    token = token.split(" ")[1];
    if (token in tokenList && tokenList[token] == mobile) {
      var payload;
      try {
        payload = jwt.verify(token, jwtKeyRefresh);
        const users = await sh_users.findOne({ where: { id: userid } });

        // console.log(payload);
        const newToken = jwt.sign(
          { userid: payload.userid, deviceid: payload.deviceid },
          jwtKey,
          {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
          }
        );

        return res.status(200).json({
          error: false,
          message: "success",
          result: {
            msg: "Token generated successfully",
            user: {
              userid: users.id,
              username: users.username,
              mobile: users.mobile,
              emailId: users.email,
              password: users.password,
            },
            _token: newToken,
          },
        });
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          console.log(e.message);
          var data = {
            error: true,
            message: "Not a valid Token",
          };
          return res.status(200).json(data);
        } else {
          console.log(e.message);
          var data = {
            error: true,
            message: "Login Again...",
          };
          return res.status(200).json(data);
        }
      }
    } else {
      const data = {
        error: true,
        message: {
          msg: "Unauthorized access",
        },
      };
      return res.status(200).json(data);
    }
  }
};

module.exports = { signIn, welcome, generateToken };
