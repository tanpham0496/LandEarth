import React, {useEffect} from "react";
import { landActions,  MessageBoxNew, screenActions, socketActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import {useSelector, useDispatch} from "react-redux";

function SellLandRemovePopup(props) {
    const {authentication: {user}, maps,lands : {forSaleLands},lands } = useSelector(state => state);

    const dispatch = useDispatch();
    const onHandleRemoveSaleLand = () => {
        dispatch(socketActions.sellLandSocket({
            userId: user._id,
            mode: 'remove_sell',
            quadKeys: props.landForSaleSelected.map(land => land.quadKey),
            zoom: maps.zoom
        }));
        setTimeout(()=> {
            dispatch(landActions.getListForSaleLands({ wToken: user.wToken }));
        }, 500);
        dispatch(screenActions.removePopup({name: 'SellLandRemovePopup'}));

    };
    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleRemoveSaleLand();
    const noBtn = () =>  dispatch(screenActions.removePopup({name: 'SellLandRemovePopup'}));
    const header = <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
}
export default SellLandRemovePopup;