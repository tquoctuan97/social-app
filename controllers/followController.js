const Follow = require('../model/Follow');

exports.addFollow = function (req, res) {
  let follow = new Follow(req.params.username, req.visitorId);
  follow
    .create()
    .then(() => {
      req.flash('success', `Successfully followed ${req.params.username}`);
      req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    })
    .catch((errors) => {
      errors.forEach((error) => {
        req.flash('errors', error);
      });
      req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    });
};

exports.apiAddFollow = function (req, res) {
  let follow = new Follow(req.params.username, req.apiUser._id);
  follow
    .create()
    .then(() => {
      res.json(true);
    })
    .catch((errors) => {
      res.json(false);
    });
};

exports.removeFollow = function (req, res) {
  let follow = new Follow(req.params.username, req.visitorId);
  follow
    .delete()
    .then(() => {
      req.flash('success', `Successfully stopped following ${req.params.username}`);
      req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    })
    .catch((errors) => {
      errors.forEach((error) => {
        req.flash('errors', error);
      });
      req.session.save(() => res.redirect(`/profile/${req.params.username}`));
    });
};

exports.apiRemoveFollow = function (req, res) {
  let follow = new Follow(req.params.username, req.apiUser._id);
  follow
    .delete()
    .then(() => {
      res.json(true);
    })
    .catch((errors) => {
      res.json(false);
    });
};
