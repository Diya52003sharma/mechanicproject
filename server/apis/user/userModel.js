const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  autoId: { type: Number }, // Auto-incremented ID
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  userType: { type: Number, required: true }, // 1=>admin, 2=>alumni, 3=>student
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
