const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    city: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Search", schema);