'use strict'
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

//Cargar Rutas
//Carga las rutas del user
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');
const publication_routes = require('./routes/publication');
const message_routes = require('./routes/message');
//#######Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
    //Cuando se recibe un dato esto lo trasnforma en un JSON
app.use(bodyParser.json());

//Cors
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//Rutas -- Rutes

app.use('/', user_routes);
app.use('/', follow_routes);
app.use('/',publication_routes);
app.use('/',message_routes);
//Exportar
module.exports = app