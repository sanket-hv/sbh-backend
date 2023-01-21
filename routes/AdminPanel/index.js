const router = require("express").Router();
const { welcome, signIn } = require("../../middleware/AdminPanel");

const dashboardRoute = require("./Dashboard.route");
const adminRoute = require("./Admin.route");
const userRoute = require("./User.route");

// Admin Sign-In
router.post("/signin", signIn);

router.use("/dashboard", welcome, dashboardRoute);

router.use("/", welcome, adminRoute);

router.use("/user", welcome, userRoute);

module.exports = router;
