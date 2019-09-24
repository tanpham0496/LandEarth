import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


function UsingNutrientSuccessAlert(props) {
    const {removePopup , user: {_id} , resultGetLandTrees , selectedLandMyLand , addPopup ,  selectedCategoryMyLand} = props;
    const reloadTreeInCategoryDetail = () => {
        const param = {
            userId: _id,
            cateIds: selectedCategoryMyLand.map(c => c._id),
            quadKeys: selectedLandMyLand.map(l => l.quadKey),
            action: 'nutrient',
            reload: true
        };
        // console.log('param', param)
        props.getLandByCateIdAndQuadKeys(param)
    };


    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading

    const resultTreeFilter = resultGetLandTrees.landTrees && resultGetLandTrees.landTrees.filter(l => l.limitUseNutritional === 2)
    const confirmBtn = () => {
        removePopup({name: 'UsingNutrientSuccessAlert'});
        reloadTreeInCategoryDetail();
        resultTreeFilter.length === 0 && removePopup({name: 'NutrientTree'})
        // resultGetLandTrees.landTrees.length - 1 === 0 && removePopup({name: 'NutrientTree'})
    } ;
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemSuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemSuccessAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens , objectsReducer: {resultGetLandTrees , selectedLandMyLand, selectedCategoryMyLand}} = state;
        return {user, screens, selectedLandMyLand ,  selectedCategoryMyLand , resultGetLandTrees};
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
        //ham nay de lay land theo quadKeys va cateId
        getLandByCateIdAndQuadKeys: (param) => dispatch(objectsActions.getLandByCateIdAndQuadKeys(param))
    })
)(UsingNutrientSuccessAlert);
