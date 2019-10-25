import React from 'react'
import {PopupRenderComponent} from "./PopupRender";
import {useDispatch} from "react-redux";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
const ConfirmUnBlockScreen = () => {
    const dispatch = useDispatch();
    const confirmFunction = () => {
        console.log('confirmFunction')
    };
    const rejectFunction = () => {
        dispatch(screenActions.removePopup({name: 'ConfirmUnBlockScreen'}))
        console.log('rejectfunction')
    };
    const props = {
        type: 'consider',
        confirm: confirmFunction,
        reject: rejectFunction
    };

    return <PopupRenderComponent {...props}/>
};
export default ConfirmUnBlockScreen
