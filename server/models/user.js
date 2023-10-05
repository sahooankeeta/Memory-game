const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please provide email"],
      unique: [true,'User email {VALUE} already exists'],
      lowercase: true,
    },
    name: {
      type: String,
      required: [true,'please provide name'],
    },
    password: {
      type: String,
      minLength: [6,'Password should be at least 6 characters'],
      required: [true,'please provide password'],
    },
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;