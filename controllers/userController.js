const User = require("../model/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  // user.login(function (result) {
  //   res.send(result);
  // });
  user
    .login()
    .then(function (response) {
      res.send(response);
    })
    .catch(function (err) {
      res.send(err);
    });
};

exports.logout = function () {};

exports.register = function (req, res) {
  // console.log(req.body);
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Register Successfully");
  }
};

exports.home = function (req, res) {
  res.render("home-guest");
};
