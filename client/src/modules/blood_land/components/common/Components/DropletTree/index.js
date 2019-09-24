import React, {Fragment, memo, useState, useEffect} from 'react'
import {Modal} from 'reactstrap';
import * as m from '../../../../../../helpers/importModule';
import TreeList from "./component/TreeList";
import cloneDeep from 'lodash.clonedeep'
import {useSelector, useDispatch} from 'react-redux'
import isEqual from "lodash.isequal"
import intersectionby from 'lodash.intersectionby'
import {screenActions} from "../../../../../../helpers/importModule";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert";
import DeadByWaterAlert from "../../Popups/commomPopups/DeadByWaterAlert";
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";
import UsingDropletConfirmAlert from "../../Popups/DropletPopups/usingDropletConfirmAlert";
import UsingDropletSuccessAlert from "../../Popups/DropletPopups/usingDropletSuccessAlert";
import UsingDropletFailureAlert from "../../Popups/DropletPopups/usingDropletFailureAlert";
import {inventoryActions} from "../../../../../../store/actions/gameActions/inventoryActions";
import * as s from "../CommonScreen";

const Droplet = memo(props => {
    const dispatch = useDispatch();
    const {authentication: {user: {_id, wToken}}, screens, inventoryReducer: {usingResult}, objectsReducer: {resultGetLandTrees, selectedLandToUseWater}, shopsReducer: {shops}} = useSelector(state => state);
    const [selectedLand, setSelectedLand] = useState();

    useEffect(() => {
        if (resultGetLandTrees) {
            if (resultGetLandTrees.status) {
                const selectedLandsUpdate = cloneDeep(resultGetLandTrees.landTrees).slice(0,300);

                selectedLandsUpdate.map(l =>
                    shops.map(s => {
                        if (s.itemId === l.itemId) {
                            l.treeInfo = {...s}
                        }
                        return s
                    })
                );
                setSelectedLand(selectedLandsUpdate)
            }
            if (resultGetLandTrees && resultGetLandTrees.err === "noTreeForWaterOrShovel") {
                return dispatch(screenActions.addPopup({name: "PlantTreeBeforeDropletAlert", close: "DropletTree"}))
            }
            if (resultGetLandTrees && resultGetLandTrees.err === 'landIsForSale') {
                return dispatch(screenActions.addPopup({name: "CheckForSaleStatusAlertForItemPopup", close: 'DropletTree'}))
            }

        }
    }, [resultGetLandTrees]);


    useEffect(() => {
        if(usingResult){
            setTimeout(() => {
                dispatch(screenActions.addPopup({
                    name: usingResult.status ? 'UsingDropletSuccessAlert' : 'UsingDropletFailureAlert',
                    close: 'LoadingPopup'
                }));
                dispatch(inventoryActions.clearSuccessError())
            }, 500)
        }
    }, [usingResult])

    const useItem = () => {
        dispatch(screenActions.addPopup({name: 'LoadingPopup'}))

        // create param for api

        const itemId = "I03";
        let trees = [];
        for (let i = 0; i < selectedLandToUseWater.length; i++) {
            const currentTree = selectedLandToUseWater[i]._id;
            trees.push(currentTree);
        }
        const param = {itemId, trees, userId: _id};
        dispatch(inventoryActions.onHandleUsingItemForTree(param))
    };
    const onHandleUsingItem = () => {
        if ((selectedLandToUseWater && selectedLandToUseWater.length === 0) || !selectedLandToUseWater) {
            dispatch(screenActions.addPopup({name: 'NoSelectedAlert'}))
        } else {
            dispatch(screenActions.addPopup({name: 'UsingDropletConfirmAlert', data: {useItem}}))
        }
    };


    return (
        <Fragment>
            {!resultGetLandTrees ? s.loadingComponent() : resultGetLandTrees.status &&
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => dispatch(screenActions.removePopup({name: 'DropletTree'}))}/>
                </div>
                <div className='custom-modal-body'>
                    <TreeList lands={selectedLand}/>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => onHandleUsingItem()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.use'}/>
                        </div>
                    </button>
                    <button onClick={() => dispatch(screenActions.removePopup({name: 'DropletTree'}))}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>}
            {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
            {screens['DeadByWaterAlert'] && <DeadByWaterAlert/>}
            {screens['UsingDropletConfirmAlert'] && <UsingDropletConfirmAlert/>}
            {screens['UsingDropletSuccessAlert'] && <UsingDropletSuccessAlert/>}
            {screens['UsingDropletFailureAlert'] && <UsingDropletFailureAlert/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
        </Fragment>

    )

});

export default Droplet
