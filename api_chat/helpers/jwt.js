const expressJwt = require('express-jwt');
const config = require('./config');
const userService = require('../containers/users/services');

module.exports = jwt;

function jwt() {
    const secret = config.secret;

    const filter = function(req) {return true;};
    return expressJwt({secret,isRevoked}).unless(filter)
}

async function isRevoked(req, payload, done) {
    const user = await userService.jwtToken({_id: payload.sub, userName: payload.name});
    if (!user) return done(null, true);
    done();
}
