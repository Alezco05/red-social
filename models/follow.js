//Utilizado para las caracterictisca de EMASCRIPT 6
'use strict'
//Provee Schemas para las bases de datos
const mongoose = require('mongoose');
// Un esquema de base de datos representa la configuración lógica de todo 
//o parte de una base de datos relacional. 
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    //Usuario que sigue
    user: { type: Schema.ObjectId, ref: 'User' },
    //Usuario seguido
    followed: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Follow', FollowSchema);