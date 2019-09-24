import React, {Fragment, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import NoIdentityCardComponent from "./NoIdentityCardComponent";
import IdentityCardComponent from "./IdentityCardComponent";
import {
    screenActions
} from "../../../../../helpers/importModule"

function IdentityCard(props){
    const dispatch = useDispatch();
    const {screens} = useSelector(state => state);
    useEffect(() => {
        dispatch(screenActions.addPopup({ name: "NoIdentityCardComponent", close: "IdentityCardComponent" }))
    }, [])

    return (
        <Fragment>
            { screens["IdentityCardComponent"] && <IdentityCardComponent /> }
            { screens["NoIdentityCardComponent"] && <NoIdentityCardComponent /> }
        </Fragment>
    );
};

export default IdentityCard;