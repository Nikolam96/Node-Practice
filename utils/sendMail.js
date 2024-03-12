const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODE_HOST,
      port: process.env.NODE_PORT,
      auth: {
        user: process.env.NODE_USERNAME,
        pass: process.env.NODE_PASSWORD,
      },
    });

    transporter.verify((err, succ) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Successfully send email");
      }
    });

    await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
      to: option.email,
      subject: option.subject,
      text: option.message,
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = sendEmail;
