'use strict'

const express = require('express');
const UserController = require('../controllers/user');
//Tener acceso a lo metodos get, post, delete, etc...
let api = express.Router();
//La ruta donde va a cargar y el metodo que utiliza
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/registrer', UserController.saveUser);
api.post('/login', UserController.loginUser);



module.exports = api;