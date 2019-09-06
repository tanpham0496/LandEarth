import { apiGame } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from "../../../helpers/handleResponse";
const _ = require('../../../helpers/testTemplate');

export const objectsService = {
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId,
    getAreaObject,
    getObjectByQuadKey,
    getObjectByCategories
};

export function getAllObjects(param) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getAllObjects`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getAllObjectsByUserId(param) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getAllObjectsByUserId`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getDetailObject(param) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getDetailObject`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getOnLandObjectsByUserId(param) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getOnLandObjectsByUserId`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getAreaObject(param){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getAreaObjects`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getObjectByQuadKey(param){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getObjectByQuadKey`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getObjectByCategories(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiGame}/game/object/getObjectByCategories`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}