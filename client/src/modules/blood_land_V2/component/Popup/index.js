import React, {Fragment , useState} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import classNames from 'classnames';
import {useSelector} from "react-redux";
import ConfirmUnBlockScreen from "./confirmUnBlockScreen";
//type
//     - Yes/No popup - considerPopup
//     - confirm popup
//     - loading popup

const PopupComponent = () => {
    const {screens} = useSelector(state => state);
    return (
        <Fragment>
            {screens['ConfirmUnBlockScreen'] && <ConfirmUnBlockScreen/>}
        </Fragment>
    )
};
export default PopupComponent

