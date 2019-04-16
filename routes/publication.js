const expres = require('express');
const multipart = require('connect-multiparty');

const publicationController = require('../controllers/publication');
const md_auth = require('../middlewares/authenticated');
const api = expres.Router();
const md_upload = multipart({uploadDir: './uploads/publications'});

api.get('/probando-pub',md_auth.ensureAuth,publicationController.probrando);
api.post('/publication',md_auth.ensureAuth,publicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,publicationController.getPublications);
api.get('/publication/:id?',md_auth.ensureAuth,publicationController.getPublication);
api.get('/publications-user/:user/:page?',md_auth.ensureAuth,publicationController.getPublicationsUser);
api.delete('/publication/:id?',md_auth.ensureAuth,publicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],publicationController.uploadImage);
api.get('/get-image-pub/:imageFile',publicationController.getImageFile);


module.exports = api;


