import React, {memo, useEffect, useState, Fragment} from 'react'
import {Modal} from 'reactstrap';
import * as m from '../../../../../../helpers/importModule';
import TreeList from "./component/TreeList";
import cloneDeep from 'lodash.clonedeep'
import {useSelector, useDispatch} from 'react-redux'
import isEqual from "lodash.isequal"
import differenceBy from 'lodash.differenceby'
import intersectionby from 'lodash.intersectionby'
import {screenActions} from "../../../../../../helpers/importModule";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert"
import DeadByWaterAlert from "../../Popups/commomPopups/DeadByWaterAlert"
import NotEnoughMoneyAlert from "../../Popups/commomPopups/NotEnoughMoneyAlert"
import UsingBloodToUseNutrientAlert from "../../Popups/NutritionPopups/UsingBloodToUseNutrientAlert"
import UsingNutrientConfirmAlert from "../../Popups/NutritionPopups/UsingNutrientConfirmAlert"
import UsingNutrientSuccessAlert from "../../Popups/NutritionPopups/usingNutrientSuccessAlert"
import UsingNutrientFailureAlert from "../../Popups/NutritionPopups/usingNutrientfailureAlert"
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {inventoryActions} from "../../../../../../store/actions/gameActions/inventoryActions";
import _ from 'lodash';
import {objectsActions} from "../../../../../../helpers/importModule";
import * as s from "../CommonScreen";

const Nutrient = memo(() => {
    const dispatch = useDispatch();
    const {authentication: {user: {_id, wToken}}, objectsReducer: {resultGetLandTrees, selectedLandToUseNutrient , reload}, inventoryReducer: {itemInventory, usingResult}, shopsReducer: {shops}, screens} = useSelector(state => state);
    const [selectedLand, setSelectedLand] = useState();

    useEffect(() => {
        dispatch(inventoryActions.getItemInventoryByUserId({userId: _id}));
        dispatch(userActions.getWalletInfo({wToken}));
    }, []);

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
            } else {
                //reload nay la 1 tham so duoc truyen khi su dung nutrient success - > UsingNutrientSuccessAlert
                !reload  && dispatch(screenActions.addPopup({name:resultGetLandTrees.err === "enoughNutrient" && "UseLimitedItemAlert" , close: "NutrientTree"}));
                !reload  && dispatch(screenActions.addPopup({name:resultGetLandTrees.err === "landIsForSale" && "CheckForSaleStatusAlertForItemPopup", close: "NutrientTree"}));
                !reload  && dispatch(screenActions.addPopup({name:resultGetLandTrees.err === "noTreeForNutrient" && "PlantTreeBeforeNutrientAlert", close: "NutrientTree"}))

            }
        }
    }, [resultGetLandTrees]);

    useEffect(() => {
        if (usingResult) {
            // const selectedLandClone = _.cloneDeep(selectedLand);
            // const selectedLandAfterUseNutrient = _.differenceBy(selectedLandClone, selectedLandToUseNutrient, '_id');
            setTimeout(() => {
                dispatch(screenActions.addPopup({
                    name: usingResult.status ? 'UsingNutrientSuccessAlert' : 'UsingNutrientFailureAlert',
                    close: 'LoadingPopup',
                    // data: {selectedLandAfterUseNutrient}
                }));
                // console.log('selectedLandClone', selectedLandClone)
                dispatch(inventoryActions.clearSuccessError());
                // setSelectedLand(selectedLandClone)
            }, 500)
        }
    });
    const confirmUsingNutrient = () => {
        dispatch(screenActions.addPopup({name: 'LoadingPopup'}));

        // create param for api
        const itemId = "I01";
        let trees = [];
        for (let i = 0; i < selectedLandToUseNutrient.length; i++) {
            const currentTree = selectedLandToUseNutrient[i]._id;
            trees.push(currentTree);
        }
        const param = {itemId, trees, userId: _id};
        dispatch(inventoryActions.onHandleUsingItemForTree(param))
        // dispatch(objectsActions.getLandToUseNutrient([]))
    };

    const onHandleUsingItem = () => {
        const nutrient = itemInventory && itemInventory.find(i => i.itemId === "I01");
        if (!selectedLandToUseNutrient || selectedLandToUseNutrient.length === 0) {
            dispatch(screenActions.addPopup({name: 'NoSelectedAlert'}))
        } else if (selectedLandToUseNutrient.length > nutrient.quantity) {
            const needGoldBlood = nutrient.price * (selectedLandToUseNutrient.length - nutrient.quantity);
            dispatch(screenActions.addPopup({
                name: 'UsingBloodToUseNutrientAlert',
                data: {needGoldBlood, confirmUsingNutrient}
            }))
        } else {
            dispatch(screenActions.addPopup({name: 'UsingNutrientConfirmAlert', data: {confirmUsingNutrient}}))
        }
    };

    return (
        <Fragment>
            {!resultGetLandTrees ? s.loadingComponent() : resultGetLandTrees.status &&
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => dispatch(screenActions.removePopup({name: 'NutrientTree'}))}/>
                </div>
                <div className='custom-modal-body'>
                    <TreeList lands={selectedLand}/>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => onHandleUsingItem()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.use'}/>
                        </div>
                    </button>
                    <button onClick={() => dispatch(screenActions.removePopup({name: 'NutrientTree'}))}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>}
            {screens['NoSelectedAlert'] && <NoSelectedAlert />}
            {screens['DeadByWaterAlert'] && <DeadByWaterAlert/>}
            {screens['NotEnoughMoneyAlert'] && <NotEnoughMoneyAlert/>}
            {screens['UsingBloodToUseNutrientAlert'] && <UsingBloodToUseNutrientAlert/>}
            {screens['UsingNutrientConfirmAlert'] && <UsingNutrientConfirmAlert/>}
            {screens['UsingNutrientSuccessAlert'] && <UsingNutrientSuccessAlert/>}
            {screens['UsingNutrientFailureAlert'] && <UsingNutrientFailureAlert/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
        </Fragment>
    )
});

export default Nutrient