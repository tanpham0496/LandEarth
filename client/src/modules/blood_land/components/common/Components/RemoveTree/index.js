import React, {memo, useState, useEffect, Fragment} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Modal} from 'reactstrap';
import * as m from '../../../../../../helpers/importModule';
import TreeList from "./component/TreeList";
import cloneDeep from 'lodash.clonedeep'
import {screenActions} from "../../../../../../helpers/importModule";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert";
import NotEnoughMoneyAlert from "../../Popups/commomPopups/NotEnoughMoneyAlert";
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";
import UsingBloodToUseShovelAlert from "../../Popups/ShovelPopups/usingBloodToUseShovelAlert";
import UsingShovelConfirmAlert from "../../Popups/ShovelPopups/usingShovelConfirmAlert";
import UsingShovelSuccessAlert from "../../Popups/ShovelPopups/usingShovelSuccessAlert";
import UsingShovelFailureAlert from "../../Popups/ShovelPopups/usingShovelFailureAlert";
import {inventoryActions} from "../../../../../../helpers/importModule";
import {userActions} from "../../../../../../helpers/importModule";
import _ from 'lodash'
import {objectsActions} from "../../../../../../helpers/importModule";


const RemoveTree = memo(props => {
    const dispatch = useDispatch();
    const {authentication: {user: {_id, wToken}}, screens, inventoryReducer: {itemInventory , usingResult}, objectsReducer: {resultGetLandTrees, selectedLandToRemove}, shopsReducer: {shops}} = useSelector(state => state);
    const [selectedLand, setSelectedLand] = useState();

    useEffect(() => {
        dispatch(inventoryActions.getItemInventoryByUserId({userId: _id}));
        dispatch(userActions.getWalletInfo({wToken}));
    }, []);

    useEffect(() => {
        if (resultGetLandTrees) {
            const selectedLandsUpdate = cloneDeep(resultGetLandTrees.landTrees);

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
    }, [resultGetLandTrees]);

    useEffect(() => {
        if (usingResult) {
            const selectedLandClone = _.cloneDeep(selectedLand);
            const selectedLandAfterRemove = _.differenceBy(selectedLandClone, selectedLandToRemove, '_id');
            setTimeout(() => {
                dispatch(screenActions.addPopup({
                    name: usingResult.status ? 'UsingShovelSuccessAlert' : 'UsingShovelFailureAlert',
                    close: 'LoadingPopup',
                    data: {selectedLandAfterRemove}
                }));
                dispatch(inventoryActions.clearSuccessError());
                setSelectedLand(selectedLandAfterRemove)
            }, 500)
        }
    });
    const confirmUsingShovel = () => {
        dispatch(screenActions.addPopup({name: 'LoadingPopup'}));

        // create param for api
        const itemId = "I02";
        let trees = [];
        for (let i = 0; i < selectedLandToRemove.length; i++) {
            const currentTree = selectedLandToRemove[i]._id;
            trees.push(currentTree);
        }

        const param = {itemId, trees, userId: _id};
        dispatch(inventoryActions.onHandleUsingItemForTree(param))
    };

    const onHandleUsingItem = () => {
        const shovel = itemInventory && itemInventory.find(i => i.itemId === "I02");


        if (!selectedLandToRemove || selectedLandToRemove.length === 0) {
            dispatch(screenActions.addPopup({name: 'NoSelectedAlert'}))
        } else if (selectedLandToRemove.length > shovel.quantity) {
            const needGoldBlood = shovel.price * (selectedLandToRemove.length - shovel.quantity)
            dispatch(screenActions.addPopup({
                name: 'UsingBloodToUseShovelAlert',
                data: {needGoldBlood, confirmUsingShovel}
            }))
        } else {
            dispatch(screenActions.addPopup({name: 'UsingShovelConfirmAlert', data: {confirmUsingShovel}}))
        }

    };

    return (
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => dispatch(screenActions.removePopup({name: 'shovel'}))}/>
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
                    <button onClick={() => dispatch(screenActions.removePopup({name: 'shovel'}))}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
            {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
            {screens['NotEnoughMoneyAlert'] && <NotEnoughMoneyAlert/>}
            {screens['UsingBloodToUseShovelAlert'] && <UsingBloodToUseShovelAlert/>}
            {screens['UsingShovelConfirmAlert'] && <UsingShovelConfirmAlert/>}
            {screens['UsingShovelSuccessAlert'] && <UsingShovelSuccessAlert/>}
            {screens['UsingShovelFailureAlert'] && <UsingShovelFailureAlert/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
        </Fragment>

    )
})
export default RemoveTree