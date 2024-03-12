const User = require("../pkg/user/userSchema");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");

exports.singUp = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      password: req.body.password,
    });

    let token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.cookie("jwt23", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    });

    res.status(201).json({
      status: "Created",
      data: user,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const validPassword = bcryptjs.compareSync(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send("Invalid email and password");
    }
    let token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.cookie("jwt23", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      status: "Logged in",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.role = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.auth.role)) {
      return res.status(500).send("Your dont have acsees");
    }
    next();
  };
};

exports.forgorPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("User doesn't exists ");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passreset = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passexpires = Date.now() + 30 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
    const message = `Imate 30 minuta da resetujete password ${resetUrl}`;
    const subject = "Reset password";

    await sendEmail({
      email: user.email,
      subject: subject,
      message: message,
    });

    res.send("email sended");
  } catch (error) {
    res.send(error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.id;

    const resetToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passreset: resetToken,
      passexpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("Invalid");
    }

    user.password = req.body.password;
    user.passexpires = undefined;
    user.passreset = undefined;

    await user.save();

    res.status(201).json({
      status: "New password is on",
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.logOut = async (req, res) => {
  res.clearCookie("jwt23").send("logged out");
};
