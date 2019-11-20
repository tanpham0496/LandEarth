const express = require('express');
const router = express.Router();
const services = require('../services/friends');

router.post('/add', add);
router.post('/find', find);
router.post('/block', block);
router.post('/unFriend', unFriend);
router.post('/unBlock', unBlock);
router.post('/checkStatusByUserName', checkStatusByUserName);
router.post('/getFriendListBlockList', getFriendListBlockList);
router.post('/getBeBlockedUser', getBeBlockedUser);
//add 2019.10.28
router.post('/getFriendList', getFriendList);
router.post('/getBlockFriendList', getBlockFriendList);
router.post('/sendAddFriend', sendAddFriend);

const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

module.exports = router;

function getBeBlockedUser(req, res, next) {
    services.getBeBlockedUser(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function add(req, res, next) {
    services.add(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function find(req, res, next) {
    services.find(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function block(req, res, next) {
    services.block(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function unFriend(req, res, next) {
    services.unFriend(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function unBlock(req, res, next) {
    services.unBlock(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function checkStatusByUserName(req, res, next) {
    services.checkStatusByUserName(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getFriendListBlockList(req, res, next) {
    services.getFriendListBlockList(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
// 2019.10.28
function getFriendList(req, res, next) {
    services.getFriendList(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
function getBlockFriendList(req, res, next) {
    services.getBlockFriendList(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
function sendAddFriend(req, res, next) {
    services.sendAddFriend(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
