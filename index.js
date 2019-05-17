'use strict'

process.env.PORT = process.env.PORT || 3800;

let mongoose = require('mongoose');
let app = require('./app');

//Conexion Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social', { userMongoClient: true })
    .then(() => {
        console.log("Conexion a la base de datos red_social fue exitosa");

        //Crear servidor
        app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo en http://localhost:3800');
        });
    })
    .catch((e) => {
        console.log(e);
    })