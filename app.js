'use strict'
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//Cargar Rutas
//Carga las rutas del user
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');
const publication_routes = require('./routes/publication');
//#######Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
    //Cuando se recibe un dato esto lo trasnforma en un JSON
app.use(bodyParser.json());

//Cors


//Rutas -- Rutes

app.use('/', user_routes);
app.use('/', follow_routes);
app.use('/',publication_routes);
//Exportar
module.exports = app