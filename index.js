require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT;
const cors = require("cors");
const logger = require("morgan");
const { successResponseWithData } = require("./helpers/apiResponses");

// CRON Jobs
const { addAccYearCron, userActivationCron } = require("./helpers/CronJobs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

//Cors
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.get("/sbh", (req, res) => {
  successResponseWithData(res, "Working", { message: "ok" });
});

// Importing APIs
const api = require("./apis/api");

// Using API
app.use("/api/v1", api);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    addAccYearCron().start();
    userActivationCron().start();
    console.log(`Server running on port: ${PORT}`);
  }
});

module.exports = app;
