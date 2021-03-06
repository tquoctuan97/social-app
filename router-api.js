const express = require('express');
const apiRouter = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');
const cors = require("cors")

apiRouter.use(cors())

// check token to log out front-end if expired
apiRouter.post('/checkToken', userController.checkToken);

// user related route
apiRouter.post('/getHomeFeed', userController.apiMustBeLoggedIn, userController.apiGetHomeFeed);
apiRouter.post('/login', userController.apiLogin);
apiRouter.post('/register', userController.apiRegister);

// post related routes
apiRouter.get('/post/:id', postController.apiGetSinglePost);
apiRouter.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreatePost);
apiRouter.post('/post/:id/edit', userController.apiMustBeLoggedIn, postController.apiUpdate);
apiRouter.delete('/post/:id', userController.apiMustBeLoggedIn, postController.apiDelete);
apiRouter.post('/search', postController.search);

// profile related routes
apiRouter.post(
  '/profile/:username',
  userController.ifUserExistsByApi,
  userController.shareApiProfile,
  userController.profileBasicData
);
apiRouter.get('/profile/:username/posts', userController.ifUserExistsByApi, userController.apiGetPostsByUsername);
apiRouter.get('/profile/:username/followers', userController.ifUserExistsByApi, userController.profileFollowers);
apiRouter.get('/profile/:username/following', userController.ifUserExistsByApi, userController.profileFollowing);

// follow routes
apiRouter.post('/addFollow/:username', userController.apiMustBeLoggedIn, followController.apiAddFollow);
apiRouter.post('/removeFollow/:username', userController.apiMustBeLoggedIn, followController.apiRemoveFollow);

module.exports = apiRouter;
