const express = require('express');
const apiRouter = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');
const cors = require('cors');

apiRouter.use(cors());

// check token to log out front-end if expired
apiRouter.post('/checkToken', userController.checkToken);

// user related route
apiRouter.post('/login', userController.apiLogin);
apiRouter.post('/register', userController.apiRegister);

// post related routes
apiRouter.get('/post/:id', postController.apiGetSinglePost);
apiRouter.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreatePost);
apiRouter.post('/post/:id/edit', userController.apiMustBeLoggedIn, postController.apiUpdate);
apiRouter.delete('/post/:id', userController.apiMustBeLoggedIn, postController.apiDelete);

// profile related routes
apiRouter.get(
  '/profile/:username',
  userController.ifUserExists,
  userController.shareApiProfile,
  userController.profileBasicData
);
apiRouter.get('/profile/:username/posts', userController.ifUserExists, userController.apiGetPostsByUsername);
apiRouter.get('/profile/:username/followers', userController.ifUserExists, userController.profileFollowers);
apiRouter.get('/profile/:username/following', userController.ifUserExists, userController.profileFollowing);

module.exports = apiRouter;
