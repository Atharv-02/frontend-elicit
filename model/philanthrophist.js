const mongoose = require("mongoose");

const PhilanthrophistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must Provide a name"],
    trim: true,
  },
  hashes: {
    type: Array,
    required: [true, "Must Provide a hash"],
    trim: true,
  },
  pan: {
    type: Boolean,
    required: [true, "Must Provide Whether PAN is given or not"],
    trim: true,
  },
});

module.exports = mongoose.model("Philanthropist", PhilanthrophistSchema);
