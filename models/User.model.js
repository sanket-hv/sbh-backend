const mongoose = require("../config/db");
const md5 = require("md5");

// Schema
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is must required"],
    },
    firmName: {
      type: String,
      required: [true, "Firmname is must required"],
    },
    mobileNo: {
      type: String,
      unique: true,
      required: [true, "Mobile No is must required"],
    },
    gstNo: {
      type: String,
      unique: true,
      required: [true, "GSTNo is must required"],
    },
    panNo: {
      type: String,
      unique: true,
      required: [true, "Pan No is must required"],
    },
    address: {
      type: String,
      required: [true, "Address is must required"],
    },
    state: {
      type: String,
      required: [true, "State is must required"],
    },
    userType: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      /**
       * true  => Activated
       * false => De-activated
       */
      type: Boolean,
      default: true,
    },
    reason: {
      type: String,
      default: "",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Password encryption before saving
UserSchema.pre("save", function (next) {
  // store reference
  const user = this;
  if (!user.password) {
    return next();
  } else {
    const hash = md5(user.password);
    user.password = hash;
    next();
  }
});

// Comparing password
UserSchema.methods = {
  comparePassword: (password, user) => {
    if (md5(password) === user.password) {
      return true;
    } else {
      return false;
    }
  },
};

const User = new mongoose.model("User", UserSchema);

module.exports = User;
