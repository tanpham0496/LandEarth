export const SAVE_CONNECT_SOCKET = 'SAVE_CONNECT_SOCKET';
export const USER_NEW_CONNECT = 'USER_NEW_CONNECT';
export const USER_DISCONNECTED = 'USER_DISCONNECTED';
export const SEND_MESSAGE = 'SEND_MESSAGE';

//=======RE-PERFORMENT SOCKET=======
export const TRANSFER_BLOOD_SOCKET = 'TRANSFER_BLOOD_SOCKET';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET = 'REMOVE_HISTORY_TRADING_LAND_SOCKET';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS = 'REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE = 'REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE';
export const CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET = 'CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET';
export const GET_ALL_LAND_SOCKET = 'GET_ALL_LAND_SOCKET';
export const GET_ALL_LAND_SOCKET_SUCCESS = 'GET_ALL_LAND_SOCKET_SUCCESS';
export const GET_ALL_LAND_SOCKET_FAILURE = 'GET_ALL_LAND_SOCKET_FAILURE';
export const PURCHASE_LAND = 'PURCHASE_LAND';
export const PURCHASE_LAND_SUCCESS = 'LANDS_PURCHASE_SUCCESS';
export const PURCHASE_LAND_FAILURE = 'LANDS_PURCHASE_FAILURE';
export const RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS = 'RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS';
export const RESPONSE_PURCHASE_LAND_SOCKET_FAILURE = 'RESPONSE_PURCHASE_LAND_SOCKET_FAILURE';
export const UPDATE_LANDS_OF_OTHER_USER = 'UPDATE_LANDS_OF_OTHER_USER';
export const UPDATE_LANDS_IN_STORAGE = 'UPDATE_LANDS_OF_OTHER_USER';
export const CLEAR_SOCKET_ACTION = 'CLEAR_SOCKET_ACTION';
export const SELL_LAND_SOCKET = 'SELL_LAND_SOCKET';
export const CLEAR_SELL_LAND_STATUS_SOCKET = 'CLEAR_SELL_LAND_STATUS_SOCKET';
export const RESPONSE_SELL_LAND_SOCKET_SUCCESS = 'RESPONSE_SELL_LAND_SOCKET_SUCCESS';
export const RESPONSE_SELL_LAND_SOCKET_FAILURE = 'RESPONSE_SELL_LAND_SOCKET_FAILURE';
export const TRANSFER_BLOOD_TRADING_LAND = 'TRANSFER_BLOOD_TRADING_LAND';

//============================================CHAT SOCKET==========================================



export const socketActions = {
    //=======CHAT SOCKET========
    userSendMessage,
    //=====END CHAT SOCKET======

    transferBloodTradingLand,
    clearRemoveHistoryTradingLandStatus,
    responseRemoveHistoryTradingLand,
    removeHistoryTradingLand,
    clearForSaleStatusSocket,
    sellLandSocket,
    responseSellLandSocket,
    responsePurchaseLand,
    responsePurchaseLandSocket,
    responseGetAllLandSocket,
};


//============================================CHAT SOCKET==========================================

function userSendMessage (data) {
    //console.log('data', data);
    return {  type : SEND_MESSAGE , data }
}
//=============================================END CHAT SOCKET=======================================




function transferBloodTradingLand(data){
    //return { type: TRANSFER_BLOOD_TRADING_LAND, data };
}

function clearRemoveHistoryTradingLandStatus(){
    //return { type : CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET };
}

function removeHistoryTradingLand(data){
    //return { type : REMOVE_HISTORY_TRADING_LAND_SOCKET, data };
}

function responseRemoveHistoryTradingLand(res){
    //return res.success ? { type: REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS, res } : { type: REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE, res };
}

function clearForSaleStatusSocket(){
    //return { type : CLEAR_SELL_LAND_STATUS_SOCKET }
};

function sellLandSocket(lands){
    //return { type : SELL_LAND_SOCKET, lands: lands };
}

function responseSellLandSocket(res) {
    //return res.success ? { type: RESPONSE_SELL_LAND_SOCKET_SUCCESS, res } : { type: RESPONSE_SELL_LAND_SOCKET_FAILURE, res }
}

function responsePurchaseLand(resPurchase){
    //return resPurchase.success ?
        // { type: PURCHASE_LAND_SUCCESS, resPurchase } :
        // { type: PURCHASE_LAND_FAILURE, resPurchase }
}

function responseGetAllLandSocket(res){
    //return res.lands ? { type: GET_ALL_LAND_SOCKET_SUCCESS, res } : { type: GET_ALL_LAND_SOCKET_FAILURE, res }
}

function responsePurchaseLandSocket(res){
    //return res.success ? { type: RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS, res } : { type: RESPONSE_PURCHASE_LAND_SOCKET_FAILURE, res }
}