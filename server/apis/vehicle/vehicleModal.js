const mongoose = require("mongoose");

const Vehicle = new mongoose.Schema({
  addedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  manufacturingName: {
    type: String,
  },
  modelName: {
    type: String,
    required: true,
  },
  modelYear: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  RTONo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["commercial", "private"],
  },

  status:{
    type:Boolean,
    default:true
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("vehicle", Vehicle);
