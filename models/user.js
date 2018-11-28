//Utilizado para las caracterictisca de EMASCRIPT 6
'use strict'
//Provee Schemas para las bases de datos
const mongoose = require('mongoose');
// Un esquema de base de datos representa la configuración lógica de todo 
//o parte de una base de datos relacional. 
const Schema = mongoose.Schema;

//Propiedades que va a tener el usuario
const UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

// Se exporta el modelo de mongoose que usa el metodo model User es el nombre de la entidad 
// Y UserSchema son los campos que tendra
module.exports = mongoose.model('User', UserSchema);