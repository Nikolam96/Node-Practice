const jwt = require("express-jwt");

exports.verification = jwt
  .expressjwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    getToken: (req) => {
      if (req.cookies.jwt23) {
        return req.cookies.jwt23;
      }
      return null;
    },
  })
  .unless({ path: ["/login", "/create"] });
