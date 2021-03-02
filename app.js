const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const date = require(__dirname + "/script.js");
const _ = require("lodash");
const posts = [];
mongoose.connect("mongodb://localhost/blogDB", {
  useUnifiedTopology: true,
});
const commentSchema = mongoose.Schema({
  name: String,
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  comments: [commentSchema],
  date: String,
});

const Post = mongoose.model("Post", postSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  Post.find({}, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogPosts: items });
    }
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/posts/:customPost", (req, res) => {
  const customPost = req.params.customPost;

  Post.findOne({ title: customPost }, (err, foundPost) => {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content,
        comments: foundPost.comments,
      });
    }
  });
});

app.post("/", (req, res) => {
  const postObject = new Post({
    title: req.body.postTitle,
    content: req.body.inputField,
    date: date.getDate(),
  });

  posts.push(postObject);
  postObject.save();

  res.redirect("/");
});

app.post("/posts/:customPost", (req, res) => {
  const customPost = req.params.customPost;
  const comment = { name: req.body.commenter, comment: req.body.comment };

  Post.findOne({ title: customPost }, (err, foundPost) => {
    if (err) {
      console.log(err);
    } else {
      foundPost.comments.push(comment);
      foundPost.save();
      res.redirect("/posts/" + customPost);
    }
    customPost;
  });
});

app.listen(port, () => {
  console.log("Listening on port 3000");
});
