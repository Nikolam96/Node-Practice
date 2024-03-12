const express = require("express");
const app = express();

//database
const dataBase = require("./pkg/db/index");
const user = require("./handlers/userHandler");
const blog = require("./handlers/blogHandler");
const weather = require("./handlers/thirdAPI");
const picture = require("./utils/multer");
const { verification } = require("./utils/verification");

const cookie = require("cookie-parser");
const { unless } = require("express-unless");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

dataBase.init();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.static("public"));
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);

app.use(verification);

app.post("/create", user.singUp);
app.post("/login", user.logIn);
app.post("/createblog", blog.createBlog);
app.get("/allblogs", blog.showAllBlogs);
app.get("/mineBlogs", blog.mineBlogs);
app.get("/userblogs/:id", blog.userBlogs);
app.patch("/update/:id", picture.uploadPhoto, blog.updateBlog);
app.delete("/delete/:id", blog.deleteBlog);
app.post("/reset", user.forgorPassword);
app.post("/reset/:id", user.resetPassword);
app.get("/vreme/:city", weather.getCity);
app.get("/search", blog.query);
app.get("/logout", user.logOut);
app.get("/reg", blog.searchBlog);
app.get("/sort", blog.sortBlog);

app.listen(process.env.SERVER_PORT, (err) => {
  if (err) console.log(err);
  console.log("Server is ON");
});
