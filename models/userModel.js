const mongoose = require("mongoose");

const userSchema = new mongoose.Schema( {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    mudae_alarm: {
      type: Boolean,
      default: false,
    }
  });

const User = mongoose.model("users", userSchema);

module.exports = User;