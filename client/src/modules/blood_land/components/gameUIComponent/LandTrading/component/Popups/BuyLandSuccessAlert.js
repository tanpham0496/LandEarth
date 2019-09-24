import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox, landActions} from "../../../../../../../helpers/importModule";

//validation alert
function BuyLandSuccessAlert(props) {
    const dispatch = useDispatch();
    const {authentication: {user}} = useSelector(state =>  state)
    const {prePurchaseLands, buySuccess} = props;
    const $_total_land = `<span class='text-selected'>${prePurchaseLands}</span>`;
    const $_purchased_land = `<span class='text-total'>${buySuccess}</span>`;

    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        dispatch(screenActions.removePopup({name: "BuyLandSuccessAlert"}));
        dispatch(landActions.getAllLandCategoryNew({userId: user._id}))
    };

    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getSuccessAlertPopup.body'}
                                    $_total_land={$_total_land} $_purchased_land={$_purchased_land}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default BuyLandSuccessAlert;