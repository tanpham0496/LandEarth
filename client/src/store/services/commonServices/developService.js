import { apiLand } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';

const _ = require('../../../helpers/testTemplate');


export const developService = {
    getById,
    // updateStatus,
    // send,
    createByAdmin,
    // get,
    update,
    _delete,
    haveReadDevelop
};

export function createByAdmin(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/develops/createByAdmin`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}
//
// export function get() {
//     const requestOptions = {
//         method: 'POST',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         // body: JSON.stringify()
//     };
//     return fetch(`${apiLand}/develops/get`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
// }

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body:_.body(param)
    };
    return fetch(`${apiLand}/develops/update`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}
export function _delete(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/develops/delete`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}



export function getById(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(id)
    };
    return fetch(`${apiLand}/develops/getById`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}

export function haveReadDevelop(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/develops/read`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}


