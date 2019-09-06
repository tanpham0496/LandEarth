import React, {PureComponent} from 'react';
import GoogleMap from 'google-map-react';
import connect from "react-redux/es/connect/connect";
import isEqual from 'lodash.isequal';
import {mapActions} from "../../../../store/actions/commonActions/mapActions";
import intersectionBy from 'lodash.intersectionby';
import isUndefined from 'lodash.isundefined';
import * as f from "./component/GameMapFunction";
import GameMapRender from "./component/GameMapRender";
import {objectsActions} from "../../../../store/actions/gameActions/objectsActions";
import {landActions} from "../../../../store/actions/landActions/landActions";
import {alertPopup} from "./component/A&PSchema";
import {inventoryActions} from "../../../../store/actions/gameActions/inventoryActions";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import {mapGameAction} from "../../../../store/actions/gameActions/mapGameActions";

//render single tile -> React memo (HOC)
export const SingleTile = memo((props) => {
    const {className, quadKey, landCharacters, handleShowPopupForTree} = props;
    return (
        <div className={`tile-n ` + className} id={quadKey}
             style={{position: 'relative'}}>
            {className.indexOf('center') !== -1 && <div className='centick'/>}
            <LandStatusComponent className={className}/>
            <TreePositionRender landCharacters={landCharacters} quadKey={quadKey} handleShowPopupForTree={handleShowPopupForTree}/>
        </div>
    )
});


const mapStateToProps = (state) => {
    const {
        wallet, lands, authentication: {user},
        shopsReducer: {shops},
        mapGameReducer: {arrayTileEffect},
        map, lands: {landSelected}, objectsReducer: {objects, plantStatus, objectArea }, mapGameReducer: {characterData, itemData, quadKeyBitamin}, inventoryReducer: {itemInventory, plantingResult, usingResult}
    } = state;
    return {
        user,
        lands,
        map,
        landSelected,
        objects,
        characterData,
        itemData,
        itemInventory,
        plantStatus,
        plantingResult,
        usingResult,
        wallet,
        shops,
        quadKeyBitamin,
        arrayTileEffect,
        objectArea
    };
};

const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    clearMoveTreeToMap: () => dispatch(objectsActions.clearMoveTreeToMap()),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
    clearSuccessError: () => dispatch(inventoryActions.clearSuccessError()),
    setTreeDies: (deadTrees) => dispatch(objectsActions.setTreeDies(deadTrees)),
    onHandleGetArrayTileEffect: (arrayTileEffect) => dispatch(mapGameAction.onHandleGetArrayTileEffect(arrayTileEffect)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    getAreaObject: (param) => dispatch(objectsActions.getAreaObject(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);



