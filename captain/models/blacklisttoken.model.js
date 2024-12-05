const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blacklistTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Token will be removed after 1 hour
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
