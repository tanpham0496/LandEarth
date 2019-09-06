import {developService} from "../../services/commonServices/developService";

export const GET_BY_ID_DEVELOP_SUCCESS = 'GET_BY_ID_DEVELOP_SUCCESS';
export const GET_BY_ID_DEVELOP_FAILURE = 'GET_BY_ID_DEVELOP_FAILURE';

export const GET_DEVELOP_SUCCESS = 'GET_DEVELOP_SUCCESS';
export const GET_DEVELOP_FAILURE = 'GET_DEVELOP_FAILURE';

export const UPDATE_STATUS_DEVELOP_SUCCESS = 'UPDATE_STATUS_DEVELOP_SUCCESS';
export const UPDATE_STATUS_DEVELOP_FAILURE = 'UPDATE_STATUS_DEVELOP_FAILURE';

export const SEND_DEVELOP_SUCCESS = 'SEND_DEVELOP_SUCCESS';
export const SEND_DEVELOP_FAILURE = 'SEND_DEVELOP_FAILURE';

export const CREATE_DEVELOP_SUCCESS = 'CREATE_DEVELOP_SUCCESS';
export const CREATE_DEVELOP_FAILURE = 'CREATE_DEVELOP_FAILURE';

export const UPDATE_DEVELOP_SUCCESS = 'UPDATE_DEVELOP_SUCCESS';
export const UPDATE_DEVELOP_FAILURE = 'UPDATE_DEVELOP_FAILURE';

export const DELETE_DEVELOP_SUCCESS = 'DELETE_DEVELOP_SUCCESS';
export const DELETE_DEVELOP_FAILURE = 'DELETE_DEVELOP_FAILURE';

export const OPEN_DEVELOP = 'OPEN_DEVELOP';
export const developmentalAction = {
    // getById,
    // updateStatus,
    // send,
    // onOpenNotify,
    //tan
    createByAdmin,
    get,
    update,
    _delete
};
function createByAdmin(param) {
    return dispatch => {
        developService.createByAdmin(param)
            .then(
                develops => {
                    dispatch( {type: CREATE_DEVELOP_SUCCESS, develops } );
                },
                error => {
                    dispatch( {type: CREATE_DEVELOP_FAILURE, error } );
                }
            )

    }
}
function get() {
    return dispatch => {
        developService.get()
            .then(
                develops => {
                    dispatch( {type: GET_DEVELOP_SUCCESS, develops } );
                },
                error => {
                    dispatch( {type: GET_DEVELOP_FAILURE, error } );
                }
            )

    }
}
function update(param) {
    return dispatch => {
        developService.update(param)
            .then(
                develops => {
                    dispatch( {type: UPDATE_DEVELOP_SUCCESS, develops } );
                },
                error => {
                    dispatch( {type: UPDATE_DEVELOP_FAILURE, error } );
                }
            )

    }
}
function _delete(id) {
    return dispatch => {
        developService._delete(id)
            .then(
                develops => {
                    dispatch( {type: DELETE_DEVELOP_SUCCESS, develops } );
                },
                error => {
                    dispatch( {type: DELETE_DEVELOP_FAILURE, error } );
                }
            )

    }
}

function getById(id) {
    return dispatch => {
        developService.getById(id)
            .then(
                develops => {
                    dispatch(success(develops));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(develops) {
        return {type: GET_BY_ID_DEVELOP_SUCCESS, develops}
    }

    function failure(error) {
        return {type: GET_BY_ID_DEVELOP_FAILURE, error}
    }
}

function updateStatus(id) {
    return dispatch => {
        developService.updateStatus(id)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) {
        return {type: UPDATE_STATUS_DEVELOP_FAILURE, error}
    }
}

function send(develop) {
    return dispatch => {
        developService.send(develop)
            .then(
                develops => {
                    dispatch(success(develops));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(develops) {
        return {type: SEND_DEVELOP_SUCCESS, develops}
    }

    function failure(error) {
        return {type: SEND_DEVELOP_FAILURE, error}
    }
}

function onOpenDevelop(develop) {
    return {
        type: OPEN_DEVELOP, develop
    }
}

