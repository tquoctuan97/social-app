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

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id);
    res.render("edit-post", { post: post, errors: req.flash("errors") });
  } catch {
    res.render("404");
  }
};

exports.edit = async function (req, res) {
  try {
    let post = new Post(req.body, req.visitorId, req.params.id);
    post
      .update()
      .then((status) => {
        // the post was successfully updated in the database
        // or user did have permision but there were validation errors
        if (status == "success") {
          // post was updated in db
          req.flash("success", "Update Post Successfully");
          req.session.save(function () {
            res.redirect(`/post/${req.params.id}/edit`);
          });
        } else {
          post.errors.forEach(function (error) {
            req.flash("errors", error);
          });
          req.session.save(function () {
            res.redirect(`/post/${req.params.id}/edit`);
          });
        }
      })
      .catch();
  } catch {
    // a post with the requested id don't have exist
    // or if the current visitor is not the owner of requested post
    req.flash("error", "You don not have permision to perform that action.");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};
