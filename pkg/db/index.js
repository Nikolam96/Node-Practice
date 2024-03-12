const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../../config.env` });

const database = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

exports.init = async () => {
  try {
    await mongoose.connect(database);
    console.log("DATABASE is ON");
  } catch (error) {
    console.log(error.message);
  }
};
