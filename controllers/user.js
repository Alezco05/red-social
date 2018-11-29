'use strict'
//Libreria que permite encriptar la contraseña
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');
const mongoosePagine = require('mongoose-pagination');

//Cuando llegan datos del POST se usa body
//Cuando llegan datos del GET se usa params

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

//Registro
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
//Login
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

                    if (params.gettoken) {
                        // generar el token y devolver un token
                        return respuesta.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //Eliminar la contraseña para que no sea vista
                        user.password = undefined;
                        //Devolver datos del usuario
                        return respuesta.status(200).send({ user })

                    }
                }
                if (err) return respuesta.status(404).send({ message: 'Error en la contraseña' });

            })
        } else {
            return respuesta.status(404).send({ message: 'El usario no se ha encontrado !!!' });

        }
    })
}

//Devolver datos de un usuario
function getUser(request, respuesta) {
    let userId = request.params.id;
    User.findById(userId, (error, user) => {
        if (error) return respuesta.status(500).send({ message: 'Error en la peticion' });
        if (!user) return respuesta.status(404).send({ message: 'El usuario no existe' });
        return respuesta.status(200).send({ user });
    })
}

//Paginar a los usuarios
function getUsersPag(request, respuesta) {
    //Propiedad del jwt del user que contiene el id codificado
    let identify_user_id = request.user.sub;
    var page = 1;
    if (request.params.page) {
        page = request.params.page;
    }
    //Items por pagina
    let itemsPerPage = 5;
    //Busca los usuarios y los organiza por id
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return respuesta.status(500).send({ message: 'Error en la peticion' });
        if (!users) return respuesta.status(404).send({ message: 'No hay usuarios disponibles' });

        return respuesta.status(200).send({
            users,
            total,
            //Calculo para tomar el numero de paginas
            pages: Math.ceil(total / itemsPerPage)
        })
    });
}

//Actualizar datos de usuario
function updateUser(request, respuesta) {
    const userId = request.params.id;
    let update = request.body;

    //borrar la propiedad password
    delete update.password;

    //Comprabar que el usuario que cambia sus datos es el mismo
    if (userId != request.user.sub) {
        return respuesta.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }
    // {new:true} Parametro que se utiliza para regresar el nuevo usuario
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) return respuesta.status(500).send({ message: 'Error en la peticion' });
        if (!userUpdated) return respuesta.status(404).send({ message: 'No se ha podido actualizar el usuario' });

        return respuesta.status(200).send({ user: userUpdated });
    })

}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsersPag,
    updateUser
}