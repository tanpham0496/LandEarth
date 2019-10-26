const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');


router.post('/getMessagesByRoomId', getMessagesByRoomId);



function getMessagesByRoomId(req, res, next) {
	//console.log('getMessagesByRoomId Controller', req.body)
    services.getMessagesByRoomId(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

module.exports = router;