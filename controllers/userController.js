const User = require('../model/User')

exports.login = function () {

}

exports.logout = function () {

}

exports.register = function (req, res) {
    // console.log(req.body);
    let user = new User(req.body);
    user.register();
}

exports.home = function (req, res) {
    res.render('home-guest')
}