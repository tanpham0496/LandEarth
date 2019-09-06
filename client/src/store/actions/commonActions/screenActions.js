export const ADD_POPUP = 'ADD_POPUP';
export const REMOVE_POPUP = 'REMOVE_POPUP';

export const screenActions = {
    addPopup,
    removePopup,
};

function addPopup(screen){
    return { type: ADD_POPUP, screen };
}

function removePopup(screen){
    return { type: REMOVE_POPUP, screen };
}