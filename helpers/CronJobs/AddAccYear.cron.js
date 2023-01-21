const cron = require("node-cron");
const moment = require("moment");

const { AccYear } = require("../../models");

const addAccYearCron = () => {
  return cron.schedule("0 0 0 1 3 *", async () => {
    try {
      let startDate = moment().startOf("month").format("DD-MM-YYYY");
      let endDate = moment()
        .startOf("month")
        .add(1, "year")
        .format("DD-MM-YYYY");
      let accYear =
        moment(startDate).format("MMM, YYYY") +
        " - " +
        moment(endDate).format("MMM, YYYY");

      let obj = {
        startDate,
        endDate,
        accYear,
      };

      let newAccYear = new AccYear(obj);
      let saved = await newAccYear.save();

      console.log("ACC YEAR CREATED =>", !!saved, saved);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { addAccYearCron };
