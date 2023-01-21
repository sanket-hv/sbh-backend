const mongoose = require("mongoose");
// const { db_url } = require('./db.config.json')
const MONGO_URI = process.env.MONGO_URI,
  MONGO_DB =
    process.env.NODE_ENV == "dev"
      ? process.env.MONGO_DB_DEV
      : process.env.MONGO_DB_PROD;

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(MONGO_URI + "/" + MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to the database : " + MONGO_DB);
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

module.exports = mongoose;
