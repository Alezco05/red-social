'use strict'

const express = require('express');
const UserController = require('../controllers/user');
//Tener acceso a lo metodos get, post, delete, etc...
let api = express.Router();
//libreria para poder cargar imagenes
const multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: './uploads/users' });
//Autentificar token
let md_auth = require('../middlewares/authenticated');
//La ruta donde va a cargar y el metodo que utiliza
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsersPag);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/image-user/:imageFile', UserController.getImageFile);

module.exports = api;