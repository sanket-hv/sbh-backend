const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const { getDashboardCount } = require("../controllers/Dashboard.controller");

router.get("/", welcome, getDashboardCount);

module.exports = router;
