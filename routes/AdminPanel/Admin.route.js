const router = require("express").Router();

const {
  getAdminDetails,
  updateAdmin,
} = require("../../controllers/AdminPanel");

// Admin Routes
router.post("/", getAdminDetails);
router.put("/update", updateAdmin);

module.exports = router;
