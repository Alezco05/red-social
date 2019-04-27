const moment = require('moment');
const moongosePaginate = require('mongoose-paginate-v2');

const User = require('../models/user');
const Follow = require('../models/follow');
const Message = require('../models/message');

function probrando(req, res) {
    res.send({
        Message: 'Hola desde message'
    })
}

function saveMessage(req, res) {
    let params = req.body;
    if (!params.text || !params.receiver) return res.status(404).send({ Message: 'Enviar todos los datos necesarios' })
    let message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false
    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ Message: 'ERRO', error: err });
        if (!messageStored) return res.status(400).send({ Message: 'Error al enviar el mensaje', error: err });
        return res.send({ message: messageStored });
    })
}


function getCountMessage(req, res) {
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const options = {
        page: page,
        limit: 10
    };
    let query = { receiver: req.user.sub };
    Message.paginate(query, options, (err, messages, total) => {
        if (err) return res.sed({ message: 'Error en la peticion', err });
        if (!messages) return res.send({ message: 'No hay mensajes', err })
        return res.send({
            messages,
            total: total
        });
    });
}
function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({receiver: userId}).populate('emitter', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});
	});
}


// function getEmitMessage(req, res) {
//     let page = 1;
//     if (req.params.page) {
//         page = req.params.page;
//     }
//     let query = { emmiter: req.user.sub };
//     const options = {
//         page: page,
//         limit: 10,
//         populate: 'receiver'
//     };
//     Message.paginate(query, options, (err, messages, total) => {
//         if (err) return res.sed({ message: 'Error en la peticion', err });
//         if (!messages) return res.send({ message: 'No hay mensajes', err })
//         return res.send({
//             messages,
//             total: total
//         });
//     });
// }

function getEmitMessage(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});
	});
}

function getUnviewedMessages(req, res) {
    let query = { receiver: req.user.sub, viewed: 'false' };
    Message.count(query).exec((err, count) => {
        if (err) return res.sed({ message: 'Error en la peticion', err });
         return res.send({
            count
        });
    });
}
function setViewedMessages(req,res){
    const query = { receiver: req.user.sub, viewed: 'false' };
    const state = {viewed: 'true'}
    Message.update(query,state,{"multi":true},(err,messagesUpdate)=>{
        if (err) return res.sed({ message: 'Error en la peticion', err });
        if (!messagesUpdate) return res.send({ message: 'No hay mensajes', err });
        return res.send({
           messagesUpdate
       });
    })
}

module.exports = {
    probrando,
    saveMessage,
    getCountMessage,
    getEmitMessage,
    getUnviewedMessages,
    setViewedMessages,
    getReceivedMessages
}