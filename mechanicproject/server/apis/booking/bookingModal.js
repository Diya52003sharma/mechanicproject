const mongoose = require("mongoose");

const Booking = new mongoose.Schema({
  allServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
  ],

  bookingStatus: {
    type: String,
    enum: ["pending", "approved", "processing", "rejected","completed"],
    default: "pending",
  },

  appointmentDate: {
    type: Date,
    required: true,
  },

  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mechanic", // userId of mechanic
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },

  totalWithGST: {
    type: Number,
    required: true,
  },
  paymentDone:{ type:Boolean,default:false},
  transactionDetail:{ type:String,default:''},
  paymentAt:{ type:Date,default:null},

  createdAt: { type: Date, default: Date.now },

  customerFeedback:{ type:String,default:''},
  mechanicFeedback:{ type:String,default:''}

});

module.exports = mongoose.model("Booking", Booking);
