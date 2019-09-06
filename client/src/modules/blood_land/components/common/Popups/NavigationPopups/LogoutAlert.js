import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";
import {apiLand} from "../../../../../../helpers/config";
import {userActions} from "../../../../../../store/actions/commonActions/userActions";


function LogoutAlert(props) {
    const {removePopup} = props;

    const doLogout = () => {
        (apiLand === 'http://127.0.0.1:5001' || apiLand === 'http://127.0.0.1:5002' || apiLand === 'http://127.0.0.1:5003') ? props.userLogout() : props.userLogoutWallet();
        removePopup({name: 'LogoutTab'});
    };
    const mode = "question"; //question //info //customize
    const yesBtn = () => doLogout();
    const noBtn = () => removePopup({name: 'LogoutTab'});
    const header = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        userLogout: () => dispatch(userActions.logout()),
        userLogoutWallet: () => dispatch(userActions.logoutWallet()),
    })
)(LogoutAlert);