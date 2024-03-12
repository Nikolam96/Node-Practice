const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Must enter a name "],
      trim: true,
      validate: [validator.isAlpha, "Please re-enter your name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is not unique"],
      index: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Morate uneti sifru"],
    },
    role: {
      type: String,
      default: "user",
    },
    age: {
      type: Number,
      required: [true, "Enter your age"],
      min: 10,
      max: 80,
    },
    passreset: {
      type: String,
    },
    passexpires: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

const User = mongoose.model("NIKOLA", userSchema);

module.exports = User;
