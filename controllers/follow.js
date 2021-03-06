'use strict'

const path = require('path');
const fs = require('fs');
const mongosePaginate = require('mongoose-pagination');
const User = require('../models/user');
const Follow = require('../models/follow');

function saveFollow(request, respuesta) {
    const params = request.body;
    const follow = new Follow();
    follow.user = request.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return respuesta.status(500).send({ message: 'Error al guardar el seguimiento' });

        if (!followStored) return respuesta.status(404).send({ message: 'Se ha guardado el seguimiento' });

        return respuesta.status(200).send({ follow: followStored });
    });

}

function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al dejar de seguir' });

        return res.status(200).send({ message: 'El follow se ha eliminado!!' });
    });
}

function getFollowingUsers(request, respuesta) {
    var userId = request.user.sub;
    var page = 1;
    const itemsPerPage = 4;
    if (request.params.id && request.params.page) {
        userId = request.params.id;
    }
    if (request.params.page) {
        page = request.params.page;
    }
    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return respuesta.status(500).send({ message: 'Error al buscar' });
        followUserIds(request.user.sub).then((value) => {
            if (!follows) return respuesta.status(404).send({ message: 'NO sigues a ningun usuario' });
            else {
                return respuesta.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows,
                    users_following: value.following,
                    users_follow_me: value.followed
                });
            }
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


function getFollowedUser(request, respuesta) {
    var userId = request.user.sub;
    let page = 1;
    const itemsPerPage = 4;
    if (request.params.id && request.params.page) {
        userId = request.params.id;
    }
    if (request.params.page) {
        page = request.params.page;
    }
    Follow.find({ followed: userId }).populate('user followed').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return respuesta.status(500).send({ message: 'Error al buscar' });
        if (!follows) return respuesta.status(404).send({ message: 'NO te sigue  ningun usuario FOREVER ALONE :V' });
        else {
            followUserIds(request.user.sub).then((value) => {
                if (!follows) return respuesta.status(404).send({ message: 'NO sigues a ningun usuario' });
                else {
                    return respuesta.status(200).send({
                        total: total,
                        pages: Math.ceil(total / itemsPerPage),
                        follows,
                        users_following: value.following,
                        users_follow_me: value.followed
                    });
                }
            });
        }

    });

}
//Devolver listado de usuarios
function getMyFollows(request, respuesta) {
    let userId = request.user.sub;
    let find = Follow.find({ user: userId });
    if (request.params.followed) {
        find = Follow.find({ followed: userId });
    }
    find.populate('user followed').exec((err, follows) => {
        if (err) return respuesta.status(500).send({ message: 'Error al buscar' });
        if (!follows) return respuesta.status(404).send({ message: 'NO sigues a ningun usuario' });
        return respuesta.status(200).send({
            follows
        });
    })
}


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows
}