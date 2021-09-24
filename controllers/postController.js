const Post = require('../model/Post');

exports.create = function (req, res) {
  let post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then((newPostId) => {
      req.flash('success', 'New post successfully created.');
      req.session.save(function () {
        res.redirect(`/post/${newPostId}`);
      });
    })
    .catch((errors) => {
      errors.forEach(function (error) {
        req.flash('errors', error);
      });
      req.session.save(function () {
        res.redirect('/create-post');
      });
    });
};

exports.apiCreatePost = function (req, res) {
  let post = new Post(req.body, req.apiUser._id);
  post
    .create()
    .then((newPostId) => {
      res.json(newPostId);
    })
    .catch((errors) => {
      res.json(errors);
    });
};

exports.viewCreateScreen = function (req, res) {
  res.render('create-post', {title: 'Create a new post'});
};

exports.viewSinglePost = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    res.render('single-post-screen', {title: post.title, post: post});
  } catch {
    res.render('404');
  }
};

exports.apiGetSinglePost = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, 0);
    res.json(post);
  } catch {
    res.json(false);
  }
};

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    if (post.isVisitorOwner) {
      res.render('edit-post', {title: 'Edit Post', post: post});
    } else {
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(() => res.redirect('/'));
    }
  } catch {
    res.render('404');
  }
};

exports.edit = function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id);
  post
    .update()
    .then((status) => {
      // the post was successfully updated in the database
      // or user did have permission, but there were validation errors
      if (status == 'success') {
        // post was updated in db
        req.flash('success', 'Post successfully updated.');
        req.session.save(function () {
          res.redirect(`/post/${req.params.id}/edit`);
        });
      } else {
        post.errors.forEach(function (error) {
          req.flash('errors', error);
        });
        req.session.save(function () {
          res.redirect(`/post/${req.params.id}/edit`);
        });
      }
    })
    .catch(() => {
      // a post with the requested id doesn't exist
      // or if the current visitor is not the owner of the requested post
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(function () {
        res.redirect('/');
      });
    });
};

exports.delete = function (req, res) {
  Post.delete(req.params.id, req.visitorId)
    .then(() => {
      req.flash('success', 'Post successfully deleted.');
      req.session.save(function () {
        res.redirect(`/profile/${req.session.user.username}/`);
      });
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(function () {
        res.redirect('/');
      });
    });
};

exports.apiDelete = function (req, res) {
  Post.delete(req.params.id, req.apiUser._id)
    .then(() => {
      res.json('Post successfully deleted.');
    })
    .catch(() => {
      res.json('You do not have permission to perform that action.');
    });
};

exports.search = function (req, res) {
  Post.search(req.body.searchTerm)
    .then((posts) => {
      res.json(posts);
    })
    .catch(() => {
      res.json([]);
    });
};
