const mongoose = require("mongoose");

const Service = new mongoose.Schema({
  addedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["commercial", "private"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("service", Service);
