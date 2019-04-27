'use strict'

const express = require('express');
const FollowControler = require('../controllers/follow');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowControler.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowControler.deleteFollow);
api.get('/following/:id/:page?', md_auth.ensureAuth, FollowControler.getFollowingUsers);
api.get('/followed/:id/:page?', md_auth.ensureAuth, FollowControler.getFollowedUser);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowControler.getMyFollows);

module.exports = api;