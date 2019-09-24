const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/getById', getById);
router.post('/createByAdmin', create);
// router.post('/update', update);
router.post('/delete', _delete);
router.post('/read', read);

module.exports = router;

function create(req, res, next) {
    services.createAndGetAllDevelop(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getById(req, res, next) {
    services.getById(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

// function update(req, res, next) {

//     services.update(crypto.parsedObj(req.body))
//         .then(result => response.handleResponseWithLogs(req, res, true, result))
//         .catch(err => response.handleErrorResponse(res, err));
// }

function _delete(req, res, next) {

    services.delete(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));

}

function read(req, res, next) {

    services.read(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}