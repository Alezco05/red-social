//Utilizado para las caracterictisca de EMASCRIPT 6
'use strict'
//Provee Schemas para las bases de datos
const mongoose = require('mongoose');
// Un esquema de base de datos representa la configuración lógica de todo 
//o parte de una base de datos relacional. 
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

//Propiedades que va a tener el message

const messageSchema = new Schema({
    text: String,
    //Visto o no Visto
    viewed:String,
    //Fecha de creacion
    created_at: String,
    //Usuario que emite mensaje
    emmiter: { type: Schema.ObjectId, ref: 'User' },
    //Usuario que recibe mensaje
    receiver: { type: Schema.ObjectId, ref: 'User' }
});

messageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', messageSchema);