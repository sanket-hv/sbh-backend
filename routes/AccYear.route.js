const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const {
  getAllAccYears,
  addNewAccYear,
} = require("../controllers/AccYear.controller");

router.get("/getAll", welcome, getAllAccYears);

router.get("/addNew", welcome, addNewAccYear);

module.exports = router;
