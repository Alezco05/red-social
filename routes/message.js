'use strict'
const express = require('express');
const MessageController = require('../controllers/message');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');


api.get('/probrando-md',md_auth.ensureAuth,MessageController.probrando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?',md_auth.ensureAuth,MessageController.getCountMessage);
api.get('/messages/:page?',md_auth.ensureAuth,MessageController.getEmitMessage);
api.get('/unviewed',md_auth.ensureAuth,MessageController.getUnviewedMessages);
api.get('/setunviewed',md_auth.ensureAuth,MessageController.setViewedMessages);


module.exports = api;