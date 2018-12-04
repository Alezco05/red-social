'use strict'
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//Cargar Rutas
//Carga las rutas del user
const user_routes = require('./routes/user');

const follow_routes = require('./routes/follow');
//#######Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
    //Cuando se recibe un dato esto lo trasnforma en un JSON
app.use(bodyParser.json());

//Cors


//Rutas -- Rutes

app.use('/api', user_routes);
app.use('/api', follow_routes);

//Exportar
module.exports = app