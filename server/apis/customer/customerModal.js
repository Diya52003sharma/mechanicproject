const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  autoId: { type: Number, default: 0 },
  name: { type: String, },
  contactNo: { type: Number,  },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
  phone:{ type:String,default:''}
});
 

module.exports = mongoose.model("customer", customerSchema);
