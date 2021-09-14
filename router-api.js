const express = require('express');
const routerApi = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');

routerApi.post('/login', userController.apiLogin);
routerApi.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreatePost);

module.exports = routerApi;
