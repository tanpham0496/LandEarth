import { apiLand, apiChat } from './../config';
import io from 'socket.io-client';
import { applySocketMiddeware } from './middleware';
import { landEvent, landSocket } from './landSocket';
import { chatEvent, chatSocket } from './chatSocket';

const servers = {
    land: io(apiLand),
    chat: io(apiChat)
}

function combineEvents(...param){
    return Object.assign(...param);
}

const socketMiddleware = applySocketMiddeware(servers, combineEvents(landEvent, chatEvent));
const socketReceiver = (dispatch) => {
	
	servers.land.on('connect', () => {

		//save socket io to storage
		dispatch({ type: 'SAVE_CONNECT_SOCKET', connectData: { ...servers, socketId: servers.land.id } });

	    landSocket(dispatch, servers);
		chatSocket(dispatch, servers);

	})

}

export {
    socketMiddleware,
    socketReceiver
}
