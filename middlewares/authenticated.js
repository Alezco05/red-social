'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_red_social';

exports.ensureAuth = function(request, respuesta, next) {
    if (!request.headers.authorization) {
        return respuesta.status(403).send({ message: 'La peticion no tiene la autentificacion' })
    }
    let token = request.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.expiracion <= moment.unix()) {
            return respuesta.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (error) {
        return respuesta.status(404).send({ message: 'El token no es valido' });
    }
    request.user = payload;
    next();
}