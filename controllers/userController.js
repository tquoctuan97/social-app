const User = require("../model/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (response) {
      req.session.user = { favColor: "Blue", username: user.data.username };
      res.send(response);
    })
    .catch(function (err) {
      res.send(err);
    });
};

exports.logout = function () {};

exports.register = function (req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Register Successfully");
  }
};

exports.home = function (req, res) {
  if (req.session.user) {
    res.send("Welcome to Dashboard");
  } else {
    res.render("home-guest");
  }
};
