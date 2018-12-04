'use strict'
//Libreria que permite encriptar la contraseña
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');
const Follow = require('../models/follow');
const mongoosePagine = require('mongoose-pagination');
//Libreria para subir archivos
const fs = require('fs');
const path = require('path');

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
    const userId = request.params.id;
    User.findById(userId, (error, user) => {
        if (error) return respuesta.status(500).send({ message: 'Error en la peticion' });
        if (!user) return respuesta.status(404).send({ message: 'El usuario no existe' });
        followThisUser(request.user.sub, userId).then((value) => {
            user.password = undefined;
            return respuesta.status(200).send({ user, following: value.following, followed: value.followed })
        });
    });

}

async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id }).exec()
            .then((following) => { return following; }).catch((err) => {
                return handleerror(err);
            });
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id }).exec()
            .then((followed) => { return followed; })
            .catch((err) => {
                return handleerror(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch (e) {
        console.log(e);
    }
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
        followUserIds(identify_user_id).then((value) => {
            return respuesta.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                //Calculo para tomar el numero de paginas
                pages: Math.ceil(total / itemsPerPage)
            })
        });
    });
}
async function followUserIds(user_id) {
    const following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__uv': 0, 'user': 0 }).exec().then((follows) => {
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        return follows_clean;
    }).catch((err) => {
        return handleerror(err);
    });
    const followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__uv': 0, 'followed': 0 }).exec().then((follows) => {
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.user);
        });
        return follows_clean;
    }).catch((err) => {
        return handleerror(err);
    });
    return {
        following: following,
        followed: followed
    }
}
const getCounters = (req, res) => {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    })
}

const getCountFollow = async(user_id) => {
    try {
        // Lo hice de dos formas. "following" con callback de countDocuments y "followed" con una promesa
        let following = await Follow.countDocuments({ "user": user_id }, (err, result) => { return result });
        let followed = await Follow.countDocuments({ "followed": user_id }).then(count => count);

        return { following, followed }

    } catch (e) {
        console.log(e);
    }
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
// Subir archivo de imagenes o avatar de usuario

function uploadImage(request, respuesta) {
    const userId = request.params.id;

    if (request.files) {
        //Tomar la ruta de la imagen
        let file_path = request.files.image.path;
        console.log(file_path);
        //Dividir nombre y ruta de la imagen
        let file_split = file_path.split('\\');
        console.log(file_split);

        let file_name = file_split[2];
        console.log(file_name);

        //Sacar la extencio de la imagen
        let ext_plit = file_name.split('\.');
        let file_ext = ext_plit[1];
        console.log(file_ext);
        //Comprabar que el usuario que envia sus imagenes
        if (userId != request.user.sub) {
            return removFilesUploads(respuesta, file_path, 'No tienes permiso para actualizar este usuario');
        }
        //Comprabar extencion
        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'gif') {
            //Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return respuesta.status(500).send({ message: 'Error en la peticion' });
                if (!userUpdated) return respuesta.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                return respuesta.status(200).send({ user: userUpdated });
            });
        } else {
            return removFilesUploads(respuesta, file_path, 'La extension no es valida');
        }

    } else {
        return respuesta.status(200).send({ message: 'No se ha adjuntado ningun archivo' });
    }

}

function removFilesUploads(respuesta, file_path, message) {
    fs.unlink(file_path, () => {
        return respuesta.status(200).send({ message: message });
    });
}

function getImageFile(request, respuesta) {
    let image_file = request.params.imageFile;
    let path_file = './uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            return respuesta.sendFile(path.resolve(path_file));
        } else {
            respuesta.status.send({
                message: 'No exite la imagenes'
            });
        }
    })
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsersPag,
    updateUser,
    getCounters,
    uploadImage,
    getImageFile
}