const Post = require("../model/Post");

exports.create = function (req, res) {
  req.body["author"] = req.session.user.username;

  let post = new Post(req.body);
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
