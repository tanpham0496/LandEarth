import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {landActions, objectsActions, screenActions, TranslateLanguage} from "../../../../../helpers/importModule";
import MessageBoxNew from "../MessageBox";

function SellLandSuccessPopup(props) {
    const {gotoSellLand, currentCategoryId } = props;
    const {authentication: { user : {_id}}} = useSelector(state => state);
    const dispatch = useDispatch();
    const onHandleCloseSellLandSuccessAlert  = () => {
        const param = {
            cateId: currentCategoryId,
            userId: _id
        };
        dispatch(landActions.getAllLandById(_id));
        dispatch(objectsActions.getObjectByQuadKey(param));
        dispatch(landActions.getLandByCategoryNew(param));
        dispatch(screenActions.removePopup({names : ['SellLandSuccessPopup', 'SellLand']}))
    };

    const onHandleMoveToLandForSell = () => {
        dispatch(screenActions.removePopup({names : ['SellLandSuccessPopup', 'SellLand']}));
        dispatch(landActions.getAllLandById(_id));
        // gotoSellLand();
    };
    const mode = "question"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const yesBtn = () => onHandleMoveToLandForSell();
    const noBtn = () => onHandleCloseSellLandSuccessAlert();
    const header = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
}

export default SellLandSuccessPopup;