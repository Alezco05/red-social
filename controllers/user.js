'use strict'
//Libreria que permite encriptar la contraseña
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');

function home(request, respuesta) {
    respuesta.status(200).send({
        message: 'Hola mundo desde el servidor de NodeJs'
    });
}

function pruebas(request, respuesta) {
    console.log(request.body);
    respuesta.status(200).send({
        message: 'Accion de pruebas en el servidor de NodeJs'
    });
}


function saveUser(request, respuesta) {
    let params = request.body;
    let user = new User();
    if (params.name && params.surname &&
        params.nick && params.email &&
        params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        //Validar para que un usario no se repita
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return respuesta.status(500).send({ message: 'Error en la peticion de usuarios' });
            if (users && users.length >= 1) {
                return respuesta.status(200).send({ message: 'El usuario que intenta registrar ya existe' });
            }
            // En caso de que el usuario no este registrado 
            else {
                //Metodo para encriptar la contraseña Y guardar Datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, useStored) => {
                        if (err) return respuesta.status(500).send({ message: 'Error al guardar el usuario' });
                        if (useStored) {
                            respuesta.status(200).send({ user: useStored });
                        } else {
                            respuesta.status(404).send({ message: 'No se ha registado el usuario' });
                        }
                    })
                });
            }
        });
    } else {
        respuesta.status(200).send({
            message: 'Envia todos los campos necesarios'
        });

    }
}

function loginUser(request, respuesta) {
    let params = request.body;
    let email = params.email;
    let password = params.password;
    User.findOne({ email: email }, (err, user) => {
        if (err) return respuesta.status(500).send({ message: 'Error al loguear el usuario' });
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                //Si todo es correcto
                if (check) {
                    //Eliminar la contraseña para que no sea vista
                    user.password = undefined;
                    //Devolver datos del usuario
                    return respuesta.status(200).send({ user })
                }
                if (err) return respuesta.status(404).send({ message: 'Error en la contraseña' });

            })
        } else {
            return respuesta.status(404).send({ message: 'El usario no se ha encontrado !!!' });

        }
    })
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}