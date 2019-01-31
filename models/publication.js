//Utilizado para las caracterictisca de EMASCRIPT 6
'use strict'
//Provee Schemas para las bases de datos
const mongoose = require('mongoose');
// Un esquema de base de datos representa la configuración lógica de todo 
//o parte de una base de datos relacional. 
const Schema = mongoose.Schema;

const PublicationShema = new Schema({
    text: String,
    file: String,
    created_at: String,
    // El tipo objectId hace referencia al campo User, es decir, el tomara el id del modelo de User
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Publication', PublicationShema);
