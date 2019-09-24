import {notifyService} from "../../services/commonServices/notifyService";

export const GET_BY_ID_NOTIFY_SUCCESS = 'GET_BY_ID_NOTIFY_SUCCESS';
export const GET_BY_ID_NOTIFY_FAILURE = 'GET_BY_ID_NOTIFY_FAILURE';

export const GET_NOTICE_SUCCESS = 'GET_NOTICE_SUCCESS';
export const GET_NOTICE_FAILURE = 'GET_NOTICE_FAILURE';

export const UPDATE_STATUS_NOTIFY_SUCCESS = 'UPDATE_STATUS_NOTIFY_SUCCESS';
export const UPDATE_STATUS_NOTIFY_FAILURE = 'UPDATE_STATUS_NOTIFY_FAILURE';

export const SEND_NOTIFY_SUCCESS = 'SEND_NOTIFY_SUCCESS';
export const SEND_NOTIFY_FAILURE = 'SEND_NOTIFY_FAILURE';
export const CREATE_NOTICE_SUCCESS = 'CREATE_NOTICE_SUCCESS';
export const CREATE_NOTICE_FAILURE = 'CREATE_NOTICE_FAILURE';

export const UPDATE_NOTICE_SUCCESS = 'UPDATE_NOTICE_SUCCESS';
export const UPDATE_NOTICE_FAILURE = 'UPDATE_NOTICE_FAILURE';

export const DELETE_NOTICE_SUCCESS = 'DELETE_NOTICE_SUCCESS';
export const DELETE_NOTICE_FAILURE = 'DELETE_NOTICE_FAILURE';

export const HAVE_READ_NOTICE_SUCCESS = 'HAVE_READ_NOTICE_SUCCESS';
export const  HAVE_READ_NOTICE_FAILURE = ' HAVE_READ_NOTICE_FAILURE';

export const OPEN_NOTIFY = 'OPEN_NOTIFY';
export const notificationAction = {
    getById,
    updateStatus,
    send,
    onOpenNotify,
    //tan
    createByAdmin,
    get,
    update,
    _delete,
    haveReadNotify
};
function createByAdmin(param) {
   return dispatch => {
       notifyService.createByAdmin(param)
           .then(
               notices => {
                   dispatch( {type: CREATE_NOTICE_SUCCESS, notices } );
               },
               error => {
                   dispatch( {type: CREATE_NOTICE_FAILURE, error } );
               }
           )

   }
}
function get() {
    return dispatch => {
        notifyService.get()
            .then(
                notices => {
                    dispatch( {type: GET_NOTICE_SUCCESS, notices } );
                },
                error => {
                    dispatch( {type: GET_NOTICE_FAILURE, error } );
                }
            )

    }
}
function update(param) {
    return dispatch => {
        notifyService.update(param)
            .then(
                notices => {
                    dispatch( {type: UPDATE_NOTICE_SUCCESS, notices } );
                },
                error => {
                    dispatch( {type: UPDATE_NOTICE_FAILURE, error } );
                }
            )

    }
}
function _delete(param) {
    return dispatch => {
        notifyService._delete(param)
            .then(
                notices => {
                    dispatch( {type: DELETE_NOTICE_SUCCESS, notices } );
                },
                error => {
                    dispatch( {type: DELETE_NOTICE_FAILURE, error } );
                }
            )

    }
}
function haveReadNotify(param) {
    return dispatch => {
        notifyService.haveReadNotify(param)
            .then(
                notices => {
                    dispatch( {type: HAVE_READ_NOTICE_SUCCESS, notices } );
                },
                error => {
                    dispatch( {type: HAVE_READ_NOTICE_FAILURE, error } );
                }
            )

    }
}

function getById(id) {
    return dispatch => {
        notifyService.getById(id)
            .then(
                notifies => {
                    dispatch(success(notifies));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) {
        return {type: GET_BY_ID_NOTIFY_SUCCESS, notifies}
    }

    function failure(error) {
        return {type: GET_BY_ID_NOTIFY_FAILURE, error}
    }
}

function updateStatus(id) {
    return dispatch => {
        notifyService.updateStatus(id)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) {
        return {type: UPDATE_STATUS_NOTIFY_FAILURE, error}
    }
}

function send(notify) {
    return dispatch => {
        notifyService.send(notify)
            .then(
                notifies => {
                    dispatch(success(notifies));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) {
        return {type: SEND_NOTIFY_SUCCESS, notifies}
    }

    function failure(error) {
        return {type: SEND_NOTIFY_FAILURE, error}
    }
}

function onOpenNotify(notice) {
    return {
        type: OPEN_NOTIFY, notice
    }
}

