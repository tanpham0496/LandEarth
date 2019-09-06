import React, {Fragment, useEffect} from 'react';
import connect from "react-redux/es/connect/connect";
import NoIdentityCardComponent from "./NoIdentityCardComponent";
import IdentityCardComponent from "./IdentityCardComponent";
import {
    screenActions
} from "../../../../../helpers/importModule"

function IdentityCard(props){
    const { screens } = props;
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         currentScreen: this.screen.default,
    //         imageStatus: "loading"
    //     };
    // }

    // handleImageLoaded() {
    //     this.setState({ imageStatus: "loaded" });
    // }
    
    // handleImageErrored() {
    //     this.setState({ imageStatus: "failed" });
    // }
    // 
    
    // handleChangeScreen = (screen) => {
    //     this.setState({
    //         lastScreen: this.state.currentScreen,
    //         currentScreen: screen,
    //     });
    // };

    useEffect(() => {
        props.addPopup({ name: "NoIdentityCardComponent", close: "IdentityCardComponent" });
    }, [])

    return (
        <Fragment>
            { screens["IdentityCardComponent"] && <IdentityCardComponent /> }
            { screens["NoIdentityCardComponent"] && <NoIdentityCardComponent /> }
        </Fragment>
    );
};

export default connect(
    state => {
        const {lands: {myLands}, authentication: {user}, wallet, screens} = state;
        return {
            user, myLands, wallet, screens
        };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(IdentityCard);

