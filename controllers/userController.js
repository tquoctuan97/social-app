const Post = require('../model/Post');
const User = require('../model/User');
const Follow = require('../model/Follow');
const jwt = require('jsonwebtoken');

exports.shareProfile = async function (req, res, next) {
  let isVisitorProfile = false;
  let isFollowing = false;
  if (req.session.user) {
    isVisitorProfile = req.profileUser._id.equals(req.session.user._id);
    isFollowing = await Follow.isVistorFollowing(req.profileUser._id, req.visitorId);
  }

  let countPostsPromise = Post.countPostsByAuthor(req.profileUser._id);
  let countFollowersPromise = Follow.countFollowersById(req.profileUser._id);
  let countFollowingPromise = Follow.countFollowingById(req.profileUser._id);

  let [postsCount, followersCount, followingCount] = await Promise.all([
    countPostsPromise,
    countFollowersPromise,
    countFollowingPromise,
  ]);

  req.postsCount = postsCount;
  req.followersCount = followersCount;
  req.followingCount = followingCount;

  req.isVisitorProfile = isVisitorProfile;
  req.isFollowing = isFollowing;

  next();
};

exports.doesUsernameExist = function (req, res) {
  User.findByUsername(req.body.username)
    .then(() => {
      res.json(true);
    })
    .catch(() => {
      res.json(false);
    });
};

exports.doesEmailExist = async function (req, res) {
  let emailBoolean = await User.findByEmail(req.body.email);
  res.json(emailBoolean);
};

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('errors', 'You must be logged in to perform that action');
    req.session.save(function () {
      res.redirect('/');
    });
  }
};

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (response) {
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
        _id: user.data._id,
      };
      req.session.save(function () {
        res.redirect('/');
      });
    })
    .catch(function (err) {
      req.flash('errors', err);
      req.session.save(function () {
        res.redirect('/');
      });
    });
};

exports.apiLogin = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(() => {
      res.json(jwt.sign({_id: user.data._id}, process.env.JWTSECRET, {expiresIn: '7d'}));
    })
    .catch(() => {
      res.json('Invalid username/password');
    });
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
};

exports.register = async function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
        _id: user.data._id,
      };
      req.session.save(function () {
        res.redirect('/');
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash('regErrors', error);
      });
      req.session.save(function () {
        res.redirect('/');
      });
    });
};

exports.home = async function (req, res) {
  if (req.session.user) {
    let posts = await Post.getFeed(req.session.user._id);
    res.render('home-dashboard', {title: 'Home', posts: posts});
  } else {
    res.render('home-guest', {
      title: 'Sign In or Sign Up',
      regErrors: req.flash('regErrors'),
    });
  }
};

exports.ifUserExists = function (req, res, next) {
  User.findByUsername(req.params.username)
    .then(function (userDocument) {
      req.profileUser = userDocument;
      next();
    })
    .catch(function () {
      res.render('404');
    });
};

exports.profilePostsScreen = function (req, res) {
  Post.findByAuthorId(req.profileUser._id)
    .then((posts) => {
      res.render('profile', {
        title: `Profile for ${req.profileUser.username}`,
        currentPage: 'posts',
        posts: posts,
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        isFollowing: req.isFollowing,
        isVisitorProfile: req.isVisitorProfile,
        count: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount},
      });
    })
    .catch(() => res.render('404'));
};

exports.profileFollowersScreen = async function (req, res) {
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id);
    res.render('profile-followers', {
      title: `Followers of ${req.profileUser.username}`,
      currentPage: 'followers',
      followers: followers,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorProfile: req.isVisitorProfile,
      count: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount},
    });
  } catch {
    res.render('404');
  }
};

exports.profileFollowingScreen = async function (req, res) {
  try {
    let following = await Follow.getFollowingById(req.profileUser._id);
    res.render('profile-following', {
      title: `${req.profileUser.username} is following`,
      currentPage: 'following',
      following: following,
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorProfile: req.isVisitorProfile,
      count: {postsCount: req.postsCount, followersCount: req.followersCount, followingCount: req.followingCount},
    });
  } catch {
    res.render('404');
  }
};
