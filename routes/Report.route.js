const router = require("express").Router();
const { welcome } = require("../middleware/Auth");

const {
  getGSTReport,
  getProductReport,
  getPaymentReport,
} = require("../controllers/Report.controller");

router.post("/gst", welcome, getGSTReport);

router.post("/product", welcome, getProductReport);

router.post("/payment", welcome, getPaymentReport);

module.exports = router;
