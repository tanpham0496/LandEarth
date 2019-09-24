const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/getById', getById);
router.post('/createByAdmin', create);
//router.post('/update', update);
router.post('/delete', _delete);
router.post('/read', read);
// router.post('/get', get);
// router.post('/updateStatus', updateStatus);

module.exports = router;

function create(req, res, next) {
    services.createAndGetAllNotification(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
function getById(req, res, next) {

    services.getById(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
// function get(req, res, next) {
//     services.get(req.body)
//         .then(result => {
//             // if(result) response.handleResponseWithLogs(req,res,false,result);
//             if(result) response.handleResponseWithLogs(req,res,false,result)
//             else {
//                 console.log('Object Return Failed: (',result,')');
//                 res.sendStatus(500);
//             }
//         })
//         .catch(err => next(err));
// }

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
// function updateStatus(req, res, next) {
//     services.updateStatus(req.body)
//         .then(result => {
//             if(result) response.handleResponseWithLogs(req,res,false,result);
//             else {
//                 console.log('Object Return Failed: (',result,')');
//                 res.sendStatus(500);
//             }
//         })
//         .catch(err => next(err));
// }
//
// function send(req, res, next) {
//     services.send(req.body)
//         .then(result => {
//             if(result) response.handleResponseWithLogs(req,res,false,result);
//             else {
//                 console.log('Object Return Failed: (',result,')');
//                 res.sendStatus(500);
//             }
//         })
//         .catch(err => next(err));
// }