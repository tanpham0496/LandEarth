import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux'
import {
    TranslateLanguage,
    loadingImage, screenActions, objectsActions
} from '../../../../../../helpers/importModule';
import * as s from "../../../common/Components/CommonScreen"
import CategoryComponent from "./component";
import Shop from '../../../veticalBarComponent/Shop';
import ItemTree from './component/itemTree'

const LandManagement = (props) => {
    const {selectedLandMyLand, selectedCategoryMyLand, lands, PREVIOUS_SCREEN, handleChangeScreen, addPopup , user: {_id} , screens} = props;

    // =====================================================================
    /**
     * getObjectByCategories '/game/object/getObjectByCategories'
     * @param  {String}     options.userId
     * @param  {Array}      options.cateIds array category (Ex: ["12345", "54321"])\
     * @param  {Array}      options.quadKeys array quadkeys (Ex: ["12345", "54321"])
     * @param  {String}     options.action  (plant, water, sholve, nutrient)
     + plant: plant tree
     + water: water tree
     + sholve: sholve tree
     + nutrient: nutrient tree
     * @return {Object}     result = { status, landTrees }
     * @return {Boolean}    result.status
     * @return {Array}      result.landTrees
     */
    const onHandleUsingItem = (type , screen) => {
        props.clearResultGetLandByCateIdsAndQuadKeys();

        const totalLandCount = selectedCategoryMyLand.reduce((total , l) => total + l.landCount , 0);
        if(selectedLandMyLand.length === 0 && selectedCategoryMyLand.length === 0){
            addPopup({name: 'NoSelectedAlert'})
        } else if(totalLandCount === 0 && selectedLandMyLand.length === 0){
            addPopup({name: 'CategoryNoLandAlert'})
        }else{
            setTimeout(() => {
                if(selectedCategoryMyLand.length === 0 && selectedLandMyLand.length === 0){
                    return  addPopup({name: 'NoSelectedAlert'})
                }else{
                    const param = {
                        userId: _id,
                        cateIds: selectedCategoryMyLand.map(c => c._id),
                        quadKeys: selectedLandMyLand.map(l => l.quadKey),
                        action: type
                    };
                    props.getLandByCateIdAndQuadKeys(param);
                    addPopup({name: screen})
                }
            })
        }
    };

    const categoryComponentProps = {
        handleChangeScreen, PREVIOUS_SCREEN
    };
    const ItemTreeProps = {
        onHandleUsingItem, handleChangeScreen, PREVIOUS_SCREEN
    };
    return (
        <Fragment>
            <div id='screen-title-my-land' className='screen-title'>
                <img src={loadingImage('/images/game-ui/tab2/nav1.svg')} alt=''/>
                <div>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned'}/>
                </div>
            </div>
            <div className='total-land'>
                <div className='total-land-title'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.myTotalLand'}/>
                </div>
                <div className='total-land-number'>
                    {(lands && lands.myLandAmount) || 0}
                </div>
            </div>
            <div className='item-for-tree-container'>
                <ItemTree {...ItemTreeProps}/>
            </div>
            {lands && lands.myLandAmount ? <CategoryComponent {...categoryComponentProps}/> : s.getNoInfoView(PREVIOUS_SCREEN, handleChangeScreen)}

            {screens['ShopTab'] && <Shop isPlanting={true}/>}

        </Fragment>
    );
};


const mapStateToProps = (state) => {
    const {lands, authentication: {user}, objectsReducer: {selectedLandMyLand, selectedCategoryMyLand}, screens} = state;
    return {
        lands, user, screens, selectedLandMyLand, selectedCategoryMyLand
    }
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    //ham nay de lay land theo quadKeys va cateId
    getLandByCateIdAndQuadKeys: (param) => dispatch(objectsActions.getLandByCateIdAndQuadKeys(param)),
    clearResultGetLandByCateIdsAndQuadKeys: () => dispatch(objectsActions.clearResultGetLandByCateIdsAndQuadKeys())
});


export default connect(mapStateToProps, mapDispatchToProps)(LandManagement)