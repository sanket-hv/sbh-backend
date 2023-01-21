const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const {
  createUser,
  getUsers,
  getUserDetails,
  updateUser,
} = require("../controllers/User.controller");

router.post("/", createUser);

router.get("/", welcome, getUsers);

router.get("/userDetails", welcome, getUserDetails);

router.post("/updateUser", welcome, updateUser);

module.exports = router;
