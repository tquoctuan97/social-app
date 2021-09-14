const express = require('express');
const routerApi = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');

routerApi.post('/login', userController.apiLogin);

module.exports = routerApi;
