const express = require('express');
const routerApi = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');
const cors = require('cors');

routerApi.use(cors());

// user related route
routerApi.post('/login', userController.apiLogin);
routerApi.post('/register', userController.apiRegister);

// post related routes
routerApi.get('/post/:id', postController.apiGetSinglePost);
routerApi.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreatePost);
routerApi.delete('/post/:id', userController.apiMustBeLoggedIn, postController.apiDelete);

// profile related routes
routerApi.get(
  '/profile/:username',
  userController.ifUserExists,
  userController.shareProfile,
  userController.profileBasicData
);
routerApi.get('/postsByAuthor/:username', userController.apiGetPostsByUsername);
apiRouter.get('/profile/:username/followers', userController.ifUserExists, userController.profileFollowers);
apiRouter.get('/profile/:username/following', userController.ifUserExists, userController.profileFollowing);

module.exports = routerApi;
