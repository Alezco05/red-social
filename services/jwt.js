'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_red_social';
//Exportar el metodo createToken que es una funcion que recibe un usuario
exports.createToken = function(user) {
    //Variable que tiene un objeto con los parametros para ecnriptar
    let payload = {
            sub: user._id,
            name: user.name,
            nick: user.nick,
            surname: user.surname,
            email: user.email,
            role: user.role,
            image: user.image,
            //Fecha de Creacion del token fecha con el metodo unix(fecha exacta)
            iat: moment().unix(),
            //Fecha de expiracion del token que serian 30 dias desde este momento
            exp: moment(30, 'days').unix

        }
        // Retorna el jwt encritado con la clave
    return jwt.encode(payload, secret);
};