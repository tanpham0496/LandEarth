﻿require('rootpath')();
const express = require('express');
const app = express();
const debug = require('debug')('api-app:server');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();
const config = require('./db/config');
const chalk = require('chalk');
const morganHelper = require('./helpers/morganHelper');
const winstonLogger = require('./helpers/logger');


//setup socket
const socketIO = require('socket.io');
const io = socketIO(server);
require('./socket')(io);

//setup resdis
require('./redisConnect');

logger.token('customMethod', morganHelper.customMethod);
logger.token('timeFormat', morganHelper.timeFormat);
logger.token('customStatus', morganHelper.customStatus);
logger.token('customResponse', morganHelper.customResponse);
logger.token('customLength', morganHelper.customLength);
logger.token('customReferral', morganHelper.customReferral);

const morganLogger = logger(function (tokens, req, res) {
    return [
        tokens['customMethod'](req, res, chalk),
        tokens['customStatus'](req, res, chalk),
        chalk.white(tokens.url(req, res)),
        tokens['customResponse'](req, res, chalk),
        tokens['customLength'](req, res, chalk),
        chalk.white(tokens['timeFormat'](req, res)),
        'from ' + tokens['customReferral'](req, res, chalk)
    ].join(' ');
});

app.use(morganLogger);
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors({ origin: true, credentials: true }));
// app.all('*', tokenMiddleware);

//request logger middleware
app.use((req, res, next) => {

    let logData = {
        url: req.originalUrl,
        time: new Date(),
        ip_client: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        params: null
    };
    if (req.method === 'POST') {
        logData.params = req.body;
    } else {
        logData.params = [];
    }
    winstonLogger.apirequest(logData);
    next();
})
// require('./routes')(app);
app.use('/messages', require('./containers/messages/controllers'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// app.use(function errorHandler(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
	
// 	if (req.originalUrl === '/users/loginWallet') {	
//         try {
//             res.redirect(302, config.loginWalletHost);
//         } catch(e) {}
// 		return; // Cannot set headers after they are sent to the client
// 	}

//     // render the error page
//     // res.status(err.status || 500);
//     // res.render('error');

//     if (typeof (err) === 'string') {
//         // custom application error
//         console.log('Error:', err);
//         return res.status(400).json({
//             status: 400,
//             message: err
//         });
//     }

//     if (err.name === 'ValidationError') {
//         // mongoose validation error
//         console.log('Error:', err.message);
//         return res.status(400).json({
//             status: 400,
//             message: err.message
//         });
//     }

//     if (err.name === 'UnauthorizedError') {
//         // jwt authentication error
//         console.log('Error:', err.message);
//         return res.status(401).json({
//             status: 401,
//             message: err.message
//         });
//     }

//     // default to 500 server error
//     console.log('Error:', err.message);
//     return res.status(500).json({
//         status: 500,
//         message: err.message
//     });
// });

console.log('process.env.NODE_ENV=', process.env.NODE_ENV);
let port;
if (process.env.NODE_ENV === 'development') port = 5003;
else if (process.env.NODE_ENV === 'production') port = 3001;
else port = 3001;

server.listen(port, function () {
    console.log('Server listening on port ' + port);
});

server.on('error', function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});