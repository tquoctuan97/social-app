const express = require('express');
const routerApi = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');
const cors = require('cors');

routerApi.use(cors());

// related user
routerApi.post('/login', userController.apiLogin);
routerApi.post('/register', userController.apiRegister);

routerApi.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreatePost);
routerApi.delete('/post/:id', userController.apiMustBeLoggedIn, postController.apiDelete);
routerApi.get('/postsByAuthor/:username', userController.apiGetPostsByUsername);

module.exports = routerApi;
