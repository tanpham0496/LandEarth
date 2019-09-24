import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


function UsingShovelSuccessAlert(props) {
    const {removePopup , user: {_id}, currentCategoryId , resultGetLandTrees, selectedCategoryMyLand ,selectedLandToRemove,selectedLandMyLand} = props;
    const reloadTreeInCategoryDetail = () => {
        const getObjectByQuadKeyParam = {
            cateId: currentCategoryId,
            userId: _id
        };
        const getLandByCateIdAndQuadKeysParam = {
            userId: _id,
            cateIds: selectedCategoryMyLand.map(c => c._id),
            quadKeys: selectedLandMyLand.map(l => l.quadKey),
            action: 'shovel',
            reload: true
        };
        props.getObjectByQuadKey(getObjectByQuadKeyParam)
        if(resultGetLandTrees.landTrees.length !== selectedLandToRemove.length || resultGetLandTrees.landTrees.length - 1 >= 0 ){
            props.getLandByCateIdAndQuadKeys(getLandByCateIdAndQuadKeysParam)
        }
        if(resultGetLandTrees.landTrees.length === selectedLandToRemove.length ){
            removePopup({name: 'RemoveTree'})
        }
        props.getLandToRemoveTree([])
    };


    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        removePopup({name: 'UsingShovelSuccessAlert'});
        reloadTreeInCategoryDetail();

    } ;
    const header = <TranslateLanguage direct={'alert.removal.getUsingItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.removal.getUsingItemSuccessAlert.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens, objectsReducer: {currentCategoryId, resultGetLandTrees, selectedCategoryMyLand ,selectedLandMyLand  , selectedLandToRemove}} = state;
        return {user, screens , resultGetLandTrees,  selectedCategoryMyLand ,selectedLandMyLand, currentCategoryId , selectedLandToRemove};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
        //ham nay de lay land theo quadKeys va cateId
        getLandByCateIdAndQuadKeys: (param) => dispatch(objectsActions.getLandByCateIdAndQuadKeys(param)),
        getLandToRemoveTree: () => dispatch(objectsActions.getLandToRemoveTree())
    })
)(UsingShovelSuccessAlert);
