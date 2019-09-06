import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
    socketActions
} from "../../../../../../helpers/importModule";


function SellLandConfirmAlert(props) {
    const {screens: {SellLandConfirmAlert: {ForSellLandSelected , modeSell}} , user, map: {zoom}} = props;
    const onHandleModifyPrice = () => {
        const arrQuadkey = [...ForSellLandSelected].reduce((quadKeys, landItem) => {
            quadKeys = quadKeys.concat({quadKey: landItem.quadKey, landPrice: landItem.sellPrice});
            return quadKeys;
        }, []);
        //re-sell after change price
        const param = {
            userId: user._id,
            forSaleStatus: true,
            quadKeys: arrQuadkey,
            mode: modeSell ? 'sell': 're_selling',
            zoom
        };
        props.sellLandSocket(param);
        props.addPopup({name: 'LoadingPopup', data: {totalLand: param.quadKeys.length} , close: 'SellLandConfirmAlert'})
    };


    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleModifyPrice();
    const noBtn = () => props.removePopup({name: 'SellLandConfirmAlert'});
    const header = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(SellLandConfirmAlert);


//
// confirmModifySellLand = () => {


//
//     this.setState({
//         preReSellingLands: param.quadKeys,
//         reselling:true
//     });
//     this.props.sellLandSocket(param);
//     this.handleHideAlertPopup()
// };