//Librerias
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const moongosePaginate = require('mongoose-pagination');
//Modelos
const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');

function probrando(req, res) {
    res.send({
        message: "Hola desde el controlador de Publication"
    });
}

function savePublication(req, res) {
    let params = req.body;
    if (!params.text) return res.send({ message: "Debes enviar un texto!!" });
    let publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'ERROR la publicacion', err: err });
        if (!publicationStored) return res.status(400).send({ message: 'La publicacion no ha sido guardada', err: err });
        res.send({ publication: publicationStored });
    });

}

function getPublications(req, res) {
    let page = 1;
    if (req.params.page) page = req.params.page;

    let itemsPerPage = 4;

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'ERROR en la funcion', err: err });
        let follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        Publication.find({
            user:
                { "$in": follows_clean }
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'ERROR al devolver publicaciones', err: err });
            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });
            return res.send({
                total_items: total,
                publications: publications
            });
        });
    });
}

function getPublication(req, res) {
    let publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: 'ERROR al devolver publicacion', err: err });
        if (!publication) return res.status(404).send({ message: 'No exite la publicacion' });
        return res.send({ publication });
    })
}

function deletePublication(req, res) {
    let publicationId = req.params.id;

    Publication.find({ user: req.user.sub, "_id": publicationId }).remove(err => {
        if (err) return res.status(500).send({ message: 'ERROR al devolver publicacion', err: err });
        //if (!publicationRemoved) return res.status(404).send({ message: 'No exite la publicacion' });
        return res.send({ message: 'Publicacion borrada' });
    });
}


function uploadImage(request, respuesta) {
    const publicationId = request.params.id;
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
        //Comprabar extencion
        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'gif') {
            //Actualizar documento de la publicacion
            Publication.find({ 'user': request.user.sub, '_id': publicationId }).exec((err, publication) => {
                if (publication) {
                    Publication.find(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return respuesta.status(500).send({ message: 'Error en la peticion' });
                        if (!publicationUpdated) return respuesta.status(404).send({ message: 'No se ha podido actualizar la publicacion' });

                        return respuesta.status(200).send({ publication: publicationUpdated });
                    });
                }
                else{
                    return removFilesUploads(respuesta, file_path, 'No tienes permiso para actualizar');          
                }
            }
            )

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
    let path_file = './uploads/publications/' + image_file;
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
    probrando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}