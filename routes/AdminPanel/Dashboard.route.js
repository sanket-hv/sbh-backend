const router = require("express").Router();

const {
  activateUser,
  deActivateUser,
  getUsers,
  getUserDetails,
} = require("../../controllers/AdminPanel");

// User activation / de-activation routes
router.post("/user/activate", activateUser);
router.post("/user/deactivate", deActivateUser);

// User Routes
router.post("/user", getUsers);
router.post("/user/details", getUserDetails);

module.exports = router;
