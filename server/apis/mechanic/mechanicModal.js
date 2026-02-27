const mongoose = require("mongoose");

const Mechanic = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  shopName: {
    type: String,
  },
  ownerName: {
    type: String,

  },
  address: {
    type: String,
  },
  type: {
    type: String,
    enum: ["commercial", "private"],
  },
  shopCertificate: {
    type: String, // Link of certificate
  },
  contactNo: {
    type: Number,
  },
  specialization: {
    type: String,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },
  services: [
    {
      serviceId:{ type: mongoose.Schema.Types.ObjectId, ref: "service",required:true},
      price: {type:Number,default:0,required:true}
    }
  ],
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("mechanic", Mechanic);
