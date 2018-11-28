'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

//Conexion Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social', { userMongoClient: true })
    .then(() => {
        console.log("Conexion a la base de datos red_social fue exitosa");

        //Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:3800');
        });
    })
    .catch((e) => {
        console.log(e);
    })