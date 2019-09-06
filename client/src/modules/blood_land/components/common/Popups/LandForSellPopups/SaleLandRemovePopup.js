import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
    socketActions,
    landActions
} from "../../../../../../helpers/importModule";

function SellLandRemovePopup(props) {
    const {screens: {SaleLandRemovePopup: {landForSaleSelected}} , user} = props;
    const onHandleRemoveSaleLand = () => {
        props.sellLandSocket({
            userId: user._id,
            mode: 'remove_sell',
            quadKeys: landForSaleSelected.map(land => land.quadKey),
            zoom: props.map.zoom
        });
        props.getAllLandById(user._id);
        props.removePopup({name: 'SaleLandRemovePopup'});
    };


    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleRemoveSaleLand();
    const noBtn = () => props.removePopup({name: 'SaleLandRemovePopup'});
    const header =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.header'}/>;
    const body =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(SellLandRemovePopup);

