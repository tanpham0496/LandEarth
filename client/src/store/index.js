import { combineReducers } from 'redux';
import { persistReducer  } from 'redux-persist';
import localForage from 'localforage';
import screenReducer from './reducers/commonReducers/screenReducer';
import alertReducer from './reducers/commonReducers/alertReducer';
import authenticationReducer from './reducers/commonReducers/authenticationReducer';
import chatReducer from './reducers/commonReducers/chatReducer';
import centerMapReducer from './reducers/commonReducers/centerMapReducer';
import landsReducer from './reducers/landReducers/landsReducer';

import mapReducer from './reducers/commonReducers/mapReducer';
import notifyReducer from "./reducers/commonReducers/notifyReducer";
import registrationReducer from './reducers/commonReducers/registrationReducer';
import socketReducer from './reducers/commonReducers/socketReducer';
import usersReducer from './reducers/commonReducers/usersReducer';
import userTokenReducer from "./reducers/commonReducers/userTokenReducer";
import walletReducer from "./reducers/commonReducers/walletReducer";
import settingReducer from "./reducers/commonReducers/settingReducer";
import objectsReducer from "./reducers/gameReducers/objectsReducer";
import shopsReducer from "./reducers/gameReducers/shopsReducer";
import inventoryReducer from "./reducers/gameReducers/inventoryReducer";
import mapGameReducer from "./reducers/gameReducers/mapGameReducer";
import languageReducer from "./reducers/commonReducers/languageReducer";
import bitaminReducer from './reducers/landReducers/bitaminReducer';
//tan
import developReducer from "./reducers/commonReducers/developReducer";



localForage.config({
    name: 'Web DB',
    storeName: 'keyDb'
});

const rootPersistConfig = {
    version: 0,
    key: 'keyDb',
    storage: localForage,
    whitelist: ['userToken', 'chatRooms', 'wallet', 'centerMap'],
};

const rootReducer = combineReducers({
    //=============NEW MAPBOX===========
    auth: authenticationReducer,
    maps: mapReducer,
    //===========END NEW MAPBOX==========
    screens: screenReducer,
    alert: alertReducer,
    authentication: authenticationReducer,
    registration: registrationReducer,
    users: usersReducer,
    lands: landsReducer,
    centerMap: centerMapReducer,
    sockets: socketReducer,
    chats: chatReducer,
    wallet: walletReducer,
    //map: mapReducer,
    develop: developReducer,
    notify: notifyReducer,
    userToken: userTokenReducer,
	settingReducer, //old - keep for stability
    settings: settingReducer, //create new
    objectsReducer,
    objects: objectsReducer,
    shopsReducer,
    inventoryReducer,
    mapGameReducer,
    // languageReducer,
    bitaminReducer
});

export default persistReducer(rootPersistConfig, rootReducer);
