const express = require("express");
const app = express();

const accYearRoute = require("../routes/AccYear.route");
const dashboardRoute = require("../routes/Dashboard.route");
const userRoute = require("../routes/User.route");
const partyRoute = require("../routes/Party.route");
const productRoute = require("../routes/Product.route");
const salesRoute = require("../routes/Sales.route");
const reportRoute = require("../routes/Report.route");

const { signIn } = require("../middleware/Auth");

// Admin Panel Routes
const AdminPanelRoutes = require("../routes/AdminPanel");

app.post("/signin", signIn);

app.use("/accYear", accYearRoute);

app.use("/dashboard", dashboardRoute);

app.use("/user", userRoute);

app.use("/party", partyRoute);

app.use("/product", productRoute);

app.use("/sales", salesRoute);

app.use("/report", reportRoute);

// Admin Panel
app.use("/admin", AdminPanelRoutes);

module.exports = app;
