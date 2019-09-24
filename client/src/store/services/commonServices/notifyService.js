import { apiLand } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';

const _ = require('../../../helpers/testTemplate');


export const notifyService = {
    getById,
    // updateStatus,
    // send,
    createByAdmin,
    // get,
    update,
    _delete,
    haveReadNotify
};

export function createByAdmin(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/notifies/createByAdmin`, requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}

// export function get() {
//     const requestOptions = {
//         method: 'POST',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         // body: JSON.stringify()
//     };
//     return fetch(`${apiLand}/notifies/get`, requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
// }

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/notifies/update`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}
export function _delete(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/notifies/delete`, requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}
export function haveReadNotify(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/notifies/read`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}



export function getById(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        // body: JSON.stringify({id})
        body: _.body(id)
    };
    return fetch(`${apiLand}/notifies/getById`,requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
}
//
// export function updateStatus(id) {
//     const requestOptions = {
//         method: 'POST',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         body: JSON.stringify({id: id})
//     };
//
//     return fetch(`${apiLand}/notifies/updateStatus`, requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
// }
//
// export function send(param)
// {
//     const requestOptions = {
//         method: 'POST',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         body: JSON.stringify(param)
//     };
//     return fetch(`${apiLand}/notifies/send`, requestOptions).then(handleResponses).catch(err => handleErrorResponses(err));
// }
