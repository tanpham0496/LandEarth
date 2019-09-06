const express = require('express');
const router = express.Router();
const services = require('../services');
const gameMapServices = require('../services/gameMap');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/getObjectByCategories', getObjectByCategories);
router.post('/getAreaObjects', getAreaObjects);
router.post('/getAllObjects', getAllObjects);
router.post('/getAllObjectsByUserId', getAllObjectsByUserId);
router.post('/getOnLandObjectsByUserId', getOnLandObjectsByUserId);
router.post('/getDetailObject', getDetailObject);
router.post('/profitTrees', profitTrees);
router.post('/getObjectByQuadKey', getObjectByQuadKey);


// (async() => {
// 	console.time('populate');
// 	let k = await services.getAllObjectByUserId({ userId: "5c94b271272a6f0a703b3588" });
// 	console.log('k', k);
// 	console.timeEnd('populate');
// })()


function getObjectByCategories(req, res, next) {
    gameMapServices.getObjectByCategories(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}


function getAreaObjects(req, res, next) {
    gameMapServices.getAreaObjects(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getDetailObject(req, res, next) {
    gameMapServices.getDetailObject(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getAllObjectsByUserId(req, res, next) {
    gameMapServices.getAllObjectsByUserId(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getOnLandObjectsByUserId(req, res, next) {
    gameMapServices.getOnLandObjectsByUserId(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getAllObjects(req, res, next) {
    gameMapServices.getAllObjects(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function profitTrees(req, res, next) {
    services.profitTrees(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getObjectByQuadKey(req, res, next) {
    gameMapServices.getObjectByQuadKey(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

module.exports = router;