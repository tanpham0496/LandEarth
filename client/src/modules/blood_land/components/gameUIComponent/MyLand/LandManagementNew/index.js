import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux'
import {
    TranslateLanguage,
    loadingImage, screenActions, objectsActions
} from '../../../../../../helpers/importModule';
import * as s from "../../../common/Components/CommonScreen"
import CategoryComponent from "./componentNew";

import Shop from '../../../veticalBarComponent/Shop';
import ItemTree from './componentNew/itemTree'
import cloneDeep from "lodash.clonedeep";
import {onHandleCheckLandSelected} from "./component/landManagementFunction";


const LandManagement = (props) => {
    const {selectedLandMyLand, selectedCategoryMyLand , myLands, PREVIOUS_SCREEN, handleChangeScreen, addPopup , user: {_id}} = props;


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
    const onHandleUsingItem = (type) => {
        //console.log('type', type);
        const param = {
            userId: _id,
            cateIds: selectedCategoryMyLand.map(c => c._id),
            quadKeys: selectedLandMyLand.map(l => l.quadKey),
            action: type
        };
        props.getLandByCateIdAndQuadKeys(param);
    };



    const totalLands = myLands && myLands.length;
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
                    {totalLands}
                </div>
            </div>
            <div className='item-for-tree-container'>
                <ItemTree {...ItemTreeProps}/>
            </div>
            {totalLands === 0 ? s.getNoInfoView(PREVIOUS_SCREEN, handleChangeScreen) :
                <CategoryComponent {...categoryComponentProps}/>}

            {/*{screens['shop'] && <Shop isPlanting={true} isOpen={this.state.shopModal}/>}*/}
        </Fragment>
    );
}


const mapStateToProps = (state) => {
    const {lands: {myLands}, authentication: {user}, objectsReducer: {selectedLandMyLand, selectedCategoryMyLand}, screens} = state;
    return {
        myLands, user, screens, selectedLandMyLand, selectedCategoryMyLand
    }
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    //ham nay de lay land theo quadKeys va cateId
    getLandByCateIdAndQuadKeys: (param) => dispatch(objectsActions.getLandByCateIdAndQuadKeys(param))
});


export default connect(mapStateToProps, mapDispatchToProps)(LandManagement)