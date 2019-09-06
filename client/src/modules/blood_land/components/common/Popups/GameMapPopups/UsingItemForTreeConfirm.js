import React from 'react';
import {
    screenActions, inventoryActions,
    TranslateLanguage, ItemTranslate, 
    MessageBox,
} from "../../../../../../helpers/importModule";
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';


function UsingItemForTreeConfirm(props) {
    const { usingItemData, settings, shops } = props;
    const { itemData, objectId, user } = usingItemData;
    const itemInfo = shops && shops.find(item => item.itemId === itemData.itemId);
    const itemDataParam = {userId: user._id, itemId: itemData.itemId, trees: [objectId]};
    //const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        props.onHandleUsingItemForTree(itemDataParam);
        props.addPopup({ name: 'LoadingPopup', close: 'UsingItemForTreeConfirm' , data: {mode: 'moveItemToMap'}});
    }
    const noBtn = () => props.removePopup({ name: 'UsingItemForTreeConfirm' });
    const header = <TranslateLanguage direct={'alert.getUsingItemForTreeConfirm.header'}/>

    //itemSelected,name,descriptionForShop,descriptionForDetail,descriptionForInventory,decoClass
    const name = ReactDOMServer.renderToString(<ItemTranslate itemSelected={itemInfo} name={true}
                                                              decoClass='translation' language={settings.language}/>);
    const $_item = `<span class='text-highlight'>${name}</span>`;
    const body = <TranslateLanguage direct={'alert.getUsingItemForTreeConfirm.body'} $_item={$_item}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} $_item={$_item}/>;
}

export default connect (
    state => {
        const { /*authentication: { user }, objects,*/ screens, settings, shopsReducer: {shops}, } = state;
        return { /*user, objects,*/ screens, settings, shops };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        onHandleUsingItemForTree: (param) => dispatch(inventoryActions.onHandleUsingItemForTree(param)), //use Item
    })
)(UsingItemForTreeConfirm);
