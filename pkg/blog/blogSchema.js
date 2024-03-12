const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      maxLength: 100,
      required: [true, "Morate uneti head"],
      index: "text",
      trim: true,
      validate: [validator.isAscii, "Plase enter only ASII charachers"],
    },
    post: {
      type: String,
      required: [true, "Morate uneti head"],
      index: "text",
      trim: true,
      validate: [validator.isAscii, "Plase enter only ASII charachers"],
    },
    image: {
      type: String,
      default: "default.png",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "NIKOLA",
    },
  },
  { timestamps: true }
);
blogSchema.index({ head: "text", post: "text" });

const Blog = mongoose.model("NikBlog", blogSchema);

module.exports = Blog;
