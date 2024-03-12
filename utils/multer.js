const multer = require("multer");
const uuid = require("uuid");

const imgStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/img");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `blog-${uuid.v4()}.${ext}`);
  },
});

const imgFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Please upload image", false));
  }
};

const upload = multer({
  storage: imgStorage,
  fileFilter: imgFilter,
});

exports.uploadPhoto = upload.single("picture");
