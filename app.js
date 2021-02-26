const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const date = require(__dirname + "/script.js");

const posts = [];
mongoose.connect("mongodb://localhost/blogDB");
const commentSchema = mongoose.Schema({
  name: String,
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  comments: commentSchema,
  date: String,
});

const Post = mongoose.model("Post", postSchema);

const comment1 = new Comment({
  name: "Jane Doe",
  comment: "This post is garbage",
});

const post1 = new Post({
  title: "Day 1",
  content: "This is a test",
  comments: comment1,
});

const samplePost =
  "Donec et odio nisi. Etiam sed ornare urna. Sed pharetra id neque vel efficitur. Suspendisse eu dignissim urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed maximus consectetur interdum. Aenean quis lobortis dolor. Donec et iaculis tortor. Nullam luctus rutrum massa vitae ultrices. Mauris pharetra tortor diam, id ullamcorper nulla aliquet in. In facilisis urna leo, sed laoreet nulla maximus a. In eget sagittis nulla. Nam ligula magna, ornare vel tortor nec, ultrices convallis ligula. Nulla sit amet turpis pellentesque, egestas sapien quis, commodo augue.";

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

app.post("/", (req, res) => {
  const postObject = new Post({
    title: req.body.postTitle,
    content: req.body.inputField,
    date: date.getDate(),
  });

  postObject.save();

  res.redirect("/");
});

app.listen(port, () => {
  console.log("Listening on port 3000");
});
