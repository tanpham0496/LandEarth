import {
    ADD_POPUP,
    REMOVE_POPUP
} from '../../actions/commonActions/screenActions';

export default function (state = {}, action) {
    const { name, data, close } = action.screen || action;
    switch (action.type) {
        case REMOVE_POPUP:
            // console.log('REMOVE_POPUP', state[name]);
            if(name && state[name]) delete state[name];
            return {
                ...state,
            }
        case ADD_POPUP:
            // console.log('ADD_POPUP', name);
            if(name){
                if(close && state[close]) delete state[close];
                if(state[name]) return { ...state };
                return {
                    ...state,
                    [name]: { ...data }
                }
            }
            return { ...state };
        default:
            return state
    }

}
