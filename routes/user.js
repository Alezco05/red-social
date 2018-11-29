'use strict'

const express = require('express');
const UserController = require('../controllers/user');
//Tener acceso a lo metodos get, post, delete, etc...
let api = express.Router();
//Autentificar token
let md_auth = require('../middlewares/authenticated');
//La ruta donde va a cargar y el metodo que utiliza
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/registrer', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsersPag);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;