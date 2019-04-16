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
        follows_clean.push(req.user.sub);
        Publication.find({
            user:
                { "$in": follows_clean }
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'ERROR al devolver publicaciones', err: err });
            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });
            return res.send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                itemsPerPage : itemsPerPage,
                publications: publications
            });
        });
    });
}

function getPublicationsUser(req, res) {
    let page = 1;
    if (req.params.page) page = req.params.page;

    let user = req.user.sub;
    if(req.params.user){
        user= req.params.user;
    }
    let itemsPerPage = 4;
        Publication.find({
            user: user
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'ERROR al devolver publicaciones', err: err });
            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });
            return res.send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                itemsPerPage : itemsPerPage,
                publications: publications
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


function uploadImage(req, res){
	var publicationId = req.params.id;

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
	
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) => {
				console.log(publication);
				if(publication){
					 // Actualizar documento de publicación
					 Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) =>{
						if(err) return res.status(500).send({message: 'Error en la petición'});

						if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

						return res.status(200).send({publication: publicationUpdated});
					 });
				}else{
					return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
				}
			});
				 

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(respuesta, file_path, message) {
    fs.unlink(file_path, () => {
        return respuesta.status(200).send({ message: message });
    });
}
function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+image_file;
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


module.exports = {
    probrando,
    savePublication,
    getPublications,
    getPublication,
    getPublicationsUser,
    deletePublication,
    uploadImage,
    getImageFile
}