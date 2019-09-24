import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
    landActions,
    objectsActions
} from "../../../../../../helpers/importModule";



function SellLandSuccess(props) {
    const { user: {_id}, gotoSellLand, currentCategoryId } = props;
    const onHandleCloseSellLandSuccessAlert  = () => {
        const param = {
            cateId: currentCategoryId,
            userId: _id
        };
        props.getAllLandById(_id);
        props.getObjectByQuadKey(param);
        props.getLandByCategory(param);
        props.removePopup({name: 'SellLandSuccessAlert'});
        props.removePopup({name: 'sellLand'});

    };

    const onHandleMoveToLandForSell = () => {
        props.removePopup({name: 'SellLandSuccessAlert'});
        props.removePopup({name: 'sellLand'});
        props.getAllLandById(_id);
        gotoSellLand();

    };


    const mode = "question"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const yesBtn = () => onHandleMoveToLandForSell();
    const noBtn = () => onHandleCloseSellLandSuccessAlert();
    const header = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getLandByCategory: (param) => dispatch(landActions.getLandByCategoryNew(param)),
    })
)(SellLandSuccess);