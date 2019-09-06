import React from 'react';
import {
    screenActions, inventoryActions,
    TranslateLanguage, ItemTranslate, 
    MessageBox,
} from "../../../../../../helpers/importModule";
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';



function UsingItemByBloodForTreeConfirm(props) {
    //console.log('props UsingItemByBloodForTreeConfirm', props);
    const { usingItemData, settings, shops } = props;
    const {itemData, objectId, user: {_id}} = usingItemData;
    const itemDataParam = {userId: _id, itemId: itemData.itemId, trees: [objectId]};
    const itemFind = shops.find(item => item.itemId === itemData.itemId);
    const {price} = itemFind;
    const name = ReactDOMServer.renderToString(<ItemTranslate itemSelected={itemFind} name={true}
                                                              decoClass='translation' language={settings.language}/>);

    const $_item = `<span class='text-highlight'>${name}</span>`;
    const $_price = `<span class='text-highlight'>${price}</span>`;

    //const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "blood"; //blood //success //error //delete //loading
    const yesBtn = () => {
        props.onHandleUsingItemForTree(itemDataParam);
        props.addPopup({ name: 'LoadingPopup', close: 'UsingItemByBloodForTreeConfirm' , data:{mode: 'moveItemToMap'} });
    };
    const noBtn = () => props.removePopup({ name: 'UsingItemByBloodForTreeConfirm' });
    const header = <TranslateLanguage direct={'alert.getUsingItemByBloodForTreeConfirm.header'}/>
    const body = <TranslateLanguage direct={'alert.getUsingItemByBloodForTreeConfirm.body'} $_item={$_item}
                                    $_price={$_price} language={settings.language}/>;
    return <MessageBox modal={true/*modal*/} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}
                       sign={sign}/>;
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
)(UsingItemByBloodForTreeConfirm);