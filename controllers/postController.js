const Post = require("../model/Post");

exports.create = function (req, res) {
  let post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then(() => {
      res.redirect("/");
    })
    .catch((createPostErrors) => {
      createPostErrors.forEach(function (error) {
        req.flash("errors", error);
      });
      req.session.save(function () {
        res.redirect("/create-post");
      });
    });
};

exports.viewCreateScreen = function (req, res) {
  res.render("create-post", { errors: req.flash("errors") });
};

exports.viewSinglePost = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    res.render("single-post-screen", { post: post });
  } catch {
    res.render("404");
  }
};
