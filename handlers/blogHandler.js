const Blog = require("../pkg/blog/blogSchema");
const User = require("../pkg/user/userSchema");

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      head: req.body.head,
      post: req.body.post,
      image: req.body.image,
      user: req.auth.id,
    });
    res.status(201).json({
      status: "created",
      data: blog,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.showAllBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({}, { head: 1, post: 1, _id: 1 }).populate(
      "user",
      { name: 1, email: 1, _id: 0 }
    );
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.mineBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({ user: req.auth.id });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.userBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({ user: req.params.id });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const test = await Blog.findById(req.params.id).populate("user");

    if (test.user.email !== req.auth.email) {
      return res.status(401).send("u dont have permition to update this blog");
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { head: req.body.head, post: req.body.post, image: req.body.image },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const test = await Blog.findById(req.params.id).populate("user");

    if (test.user.email !== req.auth.email) {
      return res.status(401).send("u dont have permition to delete this blog");
    }
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Deleted",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.query = async (req, res) => {
  try {
    let q = {};

    if (req.query.q) {
      q.$text = { $search: req.query.q, $caseSensitive: false };
    }
    // const book = await Blog.find({
    //   $or: [
    //     { head: { $regex: req.query.q, $options: "i" } },
    //     { post: { $regex: req.query.q, $options: "i" } },
    //   ],
    // });
    const book = await Blog.find(q);
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
  }
};

exports.searchBlog = async (req, res) => {
  try {
    const word = req.body.word;

    const blog = await Blog.find({
      $or: [
        { head: { $regex: word, $options: "i" } },
        { post: { $regex: word, $options: "i" } },
      ],
    });
    res.status(200).json(blog);
  } catch (error) {
    res.send(error.message);
  }
};

exports.sortBlog = async (req, res) => {
  try {
    const blog = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json(blog);
  } catch (error) {
    res.send(error.message);
  }
};
