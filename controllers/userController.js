const User = require("../model/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (response) {
      req.session.user = { favColor: "Blue", username: user.data.username };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};

exports.register = function (req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    user.errors.forEach(function (error) {
      req.flash("regErrors", error);
    });
    req.session.save(function () {
      res.redirect("/");
    });
  } else {
    res.send("Register Successfully");
  }
};

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
