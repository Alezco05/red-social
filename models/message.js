//Utilizado para las caracterictisca de EMASCRIPT 6
'use strict'
//Provee Schemas para las bases de datos
const mongoose = require('mongoose');
// Un esquema de base de datos representa la configuración lógica de todo 
//o parte de una base de datos relacional. 
const Schema = mongoose.Schema;

//Propiedades que va a tener el message

const MessageSchema = ({
    text: String,
    created_at: String,
    //Usuario que emite mensaje
    emmiter: { type: Schema.ObjectId, ref: 'User' },
    //Usuario que recibe mensaje
    reciver: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', MessageSchema);