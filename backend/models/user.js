const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // ✅ Minimum 6 characters required
    },
    profilePic: {
      type: String, // ✅ URL या file path store करने के लिए
      default: "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image", // ✅ Default Profile Image
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// ✅ Fix: Model को दोबारा डिफाइन होने से बचाने के लिए:
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
