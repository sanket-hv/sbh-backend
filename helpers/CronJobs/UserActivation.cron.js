const cron = require("node-cron");
const moment = require("moment");

const mongoose = require("../../config/db");

const { User, UserActivation } = require("../../models");

const userActivationCron = () => {
  return cron.schedule("0 0 * * *", async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let expiredUsers = await UserActivation.find(
        {
          endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        "user -_id",
        { $sort: { updatedAt: -1 } }
      );

      let _id = [];
      for (let user of expiredUsers) {
        if (!_id.includes(user.user.toString())) _id.push(user.user);
      }

      let users = await User.updateMany(
        {
          _id: { $in: _id },
          status: true,
          userType: "user",
        },
        { status: false, reason: "Software Expired" },
        { session }
      );

      console.log("Expired Users", expiredUsers);
      console.log("Updated Users", users);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
    } finally {
      session.endSession();
    }
  });
};

module.exports = { userActivationCron };
