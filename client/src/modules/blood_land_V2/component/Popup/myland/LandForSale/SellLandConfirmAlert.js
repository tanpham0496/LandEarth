import {useDispatch, useSelector} from "react-redux";
import {MessageBoxNew, TranslateLanguage,landActions,screenActions,socketActions} from "../../../../../../helpers/importModule";
import React from "react";

function SellLandConfirmAlert(props) {
    const dispatch = useDispatch();
    const {authentication: {user}, maps: { zoom }} = useSelector(state => state);
    const { forSellLandSelected=[], modeSell } = props;
    const onHandleModifyPrice = () => {
        const quadKeys = [...forSellLandSelected].reduce((quadKeys, landItem) => quadKeys.concat({quadKey: landItem.quadKey, landPrice: landItem.sellPrice}), []);
        const param = {
            userId: user._id,
            forSaleStatus: true,
            quadKeys,
            mode: modeSell ? 'sell': 're_selling',
            zoom
        };
        dispatch(socketActions.sellLandSocket(param));
        dispatch(screenActions.addPopup({name: 'LoadingPopup', data: {totalLand: param.quadKeys.length} , close: 'SellLandConfirmAlert'}));
        dispatch(landActions.getListForSaleLands({ wToken: user.wToken }));
    };

    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleModifyPrice();
    const noBtn = () => dispatch(screenActions.removePopup({name: 'SellLandConfirmAlert'}))
    const header = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.body'}/>;
    return <MessageBoxNew mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default SellLandConfirmAlert;