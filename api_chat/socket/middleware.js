const db = require('../db/db');
const bCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tokenTime, secret } = require('../db/config');

function middleware(socket){

    const allowEvents = [
        //'USER_NEW_CONNECT'
    ];

    socket.use(async (packet, next) => {
        if(packet){
            console.log('packet', packet);

            const [event, socketData] = packet;
            if(!socketData){
                socket.emit('ERROR', { err: "noSocketData" });
                return;
            }

            const { token, socketId, ...data } = socketData;
            //check allow event
            if(allowEvents.includes(event)) return next();

            const { status, user } = await getByToken({ token });
            if(!status){
                socket.emit('ERROR', { err: "noPassMiddleware" });
                return;
            }

            packet[1].user = user;
            console.log('===> PASS CHAT SOCKET');
            return next();
        }
    });

};

async function getByToken({ token }) {
    try {
        if (!token) return { status: false, err: 'noToken' };

        if (process.env.NODE_ENV === 'development') {
            const { status, decoded } = await verifyToken({ token });
            if (!status || !decoded || !decoded.sub || !decoded.name) return { status: false, err: 'wrongToken' };

            let user = await db.User.findOneAndUpdate({ _id: decoded.sub, userName: decoded.name }, { $set: { updatedDate: new Date() } }, { new: true });
            if (!user) return { status: false, err: 'notFoundUser' }

            const tokenNew = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, secret, { expiresIn: 4320000 });
            //console.log('tokenNew', tokenNew)
            const { hash, ...userWithoutHash } = user.toObject();

            return { status: true, user: { ...userWithoutHash, token: tokenNew } };
        } else {
            const user = await db.User.findOne({ wToken: token });
            if(!user) return { status: false, err: 'notFoundUser' };
            if(!bCrypt.compareSync(token, user.tokenHash)) return { status: false, err: 'InvalidToken' };
            
            //check date
            const now = new Date().getTime();
            const timeFromUpdateDate = Math.floor((now - user.updatedDate)/1000);
            if (timeFromUpdateDate > tokenTime) return { status: false, err: 'tokenExpire' }
            const { hash, ...userWithoutHash } = user.toObject();

            return { status: true, user: { ...userWithoutHash, token: user.wToken } };
        }
    } catch(e){
        console.log('Err', e);
        return { status: false, err: e };
    }
}

function verifyToken({ token }) {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) resolve({ status: false, err });
                resolve({ status: true, decoded });
            });
        })
    } catch (e){
        return { status: false }
    }
}


module.exports.middleware = middleware;