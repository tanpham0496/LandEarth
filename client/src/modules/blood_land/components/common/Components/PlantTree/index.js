import React, {memo, useState, useEffect, Fragment} from 'react'
import {useStore, useSelector, useDispatch} from 'react-redux'
import {Modal} from 'reactstrap';
import {
    loadingImage,
    TranslateLanguage,
    objectsActions,
    inventoryActions, screenActions
} from '../../../../../../helpers/importModule';
import TreePlanted from "./component/treePlanted";
import TreeList from "./component/treeList";
import _ from 'lodash'
import * as f from "./component/plantTreeFunction";
import NotEnoughAmountAlert from '../../Popups/PlantTreePopups/NotEnoughAmountAlert'
import NoSelectedAlert from '../../Popups/commomPopups/NoSelectedAlert'
import NoTreeInLandAlert from '../../Popups/PlantTreePopups/NoTreeInLandAlert'
import PlantTreeConfirmAlert from '../../Popups/PlantTreePopups/PlantTreeConfirmAlert'
import PlantTreeSuccessAlert from '../../Popups/PlantTreePopups/PlantingTreeSuccessAlert'
import PlantTreeFailureAlert from '../../Popups/PlantTreePopups/PlantingTreeFailureAlert'

let normalCount, whiteCount, greenCount, blueCount, bronzeCount, silverCount, goldCount, platinumCount,
    diamondCount = 0;

const PlantTree = memo(props => {
    const dispatch = useDispatch();
    const {inventoryReducer: {allTrees, plantingResult}, authentication: {user}, objectsReducer: {resultGetLandTrees, selectedLandToPlantTree}, screens} = useSelector(state => state);
    const [allTreeState, setAllTreeState] = useState();
    const [selectedLands, setSelectedLands] = useState();
    const [firstLoad, setFirstLoad] = useState(true);

    const getAllTree = () => {
        dispatch(inventoryActions.getAllTreeByUserId({userId: user._id}))
    };
    useEffect(() => {
        getAllTree();
    }, []);


    useEffect(() => {
        if (allTrees && resultGetLandTrees ) {
            if(firstLoad) {
                setSelectedLands(resultGetLandTrees.landTrees.map(land => {
                    land.treePlanted = false;
                    return land
                }));
            }
            setAllTreeState(allTrees.map(object => {
                object.remainAmount = object.maxAmount - object.usingAmount;
                return object.itemId !== 'T10' && object
            }))
        }
    }, [allTrees, resultGetLandTrees]);

    useEffect(() => {
        if (plantingResult) {
            const {status} = plantingResult;
            setTimeout(() => {
                const selectedLandClone = _.cloneDeep(selectedLands);
                const selectedLandAfterPlant = _.differenceBy(selectedLandClone, selectedLandToPlantTree, '_id');
                setSelectedLands(selectedLandAfterPlant)
                dispatch(screenActions.addPopup({
                    name: status ? 'PlantTreeSuccessAlert' : 'PlantTreeFailureAlert',
                    data: {reloadTreeInCategoryDetail , selectedLandAfterPlant },
                    close: 'LoadingPopup'
                }));
                setFirstLoad(false);

            }, 500);

        }
    }, [plantingResult]);

    const reloadTreeInCategoryDetail = () => {
        const param = {
            cateId: selectedLands[0].categoryId,
            userId: user._id
        };
        dispatch(objectsActions.getObjectByQuadKey(param));
        getAllTree();
    };
    const reloadTreeAmount = () => {
        normalCount = 0;
        whiteCount = 0;
        greenCount = 0;
        blueCount = 0;
        bronzeCount = 0;
        silverCount = 0;
        goldCount = 0;
        platinumCount = 0;
        diamondCount = 0;
    };

    const onSimulatePlantTreeProcessing = (treeFind, land) => {
        land.treePlanted = treeFind.tree;
        return land;
    };
    const onSimulatePlantTree = (itemId) => {

        let allTreesClone = _.cloneDeep(allTreeState);
        let landsSelectedClone = _.cloneDeep(selectedLands);
        reloadTreeAmount();
        const treeFind = allTreesClone.find(t => t.tree.itemId === itemId);
        let treeCount = treeFind.remainAmount;

        const landSelectedUpdate = landsSelectedClone.map(land => {
            if (selectedLandToPlantTree.some(l => l._id === land._id)) {
                if (treeCount > 0) {
                    if (land.treePlanted === false) {
                        //dat chua trong cay
                        const landUpdate = onSimulatePlantTreeProcessing(treeFind, land);
                        if (land.quadKey === landUpdate.quadKey) {
                            treeCount = treeCount - 1;
                            return landUpdate;
                        }
                    } else {
                        //dat da trong cay
                        if (land.treePlanted.itemId !== itemId) {
                            const landUpdate = onSimulatePlantTreeProcessing(treeFind, land);
                            if (land.quadKey === landUpdate.quadKey) {
                                treeCount = treeCount - 1;
                                return landUpdate;
                            }
                        } else {
                            return land
                        }

                    }
                } else {
                    return land
                }
            }
            return land
        });

        //update for tree
        landSelectedUpdate.map(land => {
            if (land.treePlanted) {
                const {treePlanted: {itemId}} = land;
                // eslint-disable-next-line default-case
                switch (itemId) {
                    case "T01":
                        normalCount++;
                        break;
                    case "T02":
                        whiteCount++;
                        break;
                    case "T03":
                        greenCount++;
                        break;
                    case "T04":
                        blueCount++;
                        break;
                    case "T05":
                        bronzeCount++;
                        break;
                    case "T06":
                        silverCount++;
                        break;
                    case "T07":
                        goldCount++;
                        break;
                    case "T08":
                        platinumCount++;
                        break;
                    case "T09":
                        diamondCount++;
                        break;
                }
            }
            return land
        });
        const paramUpdateTreeAmount = {
            allTreesClone, normalCount, whiteCount,
            greenCount, blueCount, bronzeCount,
            silverCount, goldCount, platinumCount, diamondCount
        };
        const allTreesUpdate = f.CheckAmountForAllTreeUpdateSimulateFunction(paramUpdateTreeAmount);
        setSelectedLands(landSelectedUpdate)
        setAllTreeState(allTreesUpdate)
    };

    const onHandlePlantTreeInLand = () => {
        const landHaveTreeToPlant = selectedLands.filter(l => selectedLandToPlantTree.some(land => land._id === l._id) && l.treePlanted);
        if (selectedLandToPlantTree.length === 0) {
            return dispatch(screenActions.addPopup({name: 'NoSelectedAlert'}))
        }
        if (landHaveTreeToPlant.length === 0) {
            return dispatch(screenActions.addPopup({name: 'NoTreeInLandAlert'}))
        }
        if (landHaveTreeToPlant.length !== 0) {
            let items = [];
            landHaveTreeToPlant.map(s => items.push({quadKey: s.quadKey, itemId: s.treePlanted.itemId}))
            return dispatch(screenActions.addPopup({
                name: 'PlantTreeConfirmAlert',
                data: {userId: user._id, items, reloadTreeAmount}
            }))
        }
    };

    return (
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-cultivation`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => {
                              dispatch(objectsActions.getLandToPlantTree());
                              dispatch(screenActions.removePopup({name: 'plant'}))
                          }}/>

                </div>
                <div className='custom-modal-body'>
                    <TreePlanted lands={selectedLands}/>
                    {!allTreeState ? <div>Loading</div> :
                        <TreeList treeList={allTreeState} selectedLands={selectedLandToPlantTree}
                                  onSimulatePlantTree={onSimulatePlantTree}/>}
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => onHandlePlantTreeInLand()}>
                        <img src={loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.use'}/>
                        </div>
                    </button>
                    <button onClick={() => {
                        dispatch(objectsActions.getLandToPlantTree());
                        dispatch(screenActions.removePopup({name: 'plant'}))
                    }}>
                        <img src={loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
            {screens['NotEnoughAmountAlert'] && <NotEnoughAmountAlert/>}
            {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
            {screens['NoTreeInLandAlert'] && <NoTreeInLandAlert/>}
            {screens['PlantTreeConfirmAlert'] && <PlantTreeConfirmAlert/>}
            {screens['PlantTreeSuccessAlert'] && <PlantTreeSuccessAlert/>}
            {screens['PlantTreeFailureAlert'] && <PlantTreeFailureAlert/>}
        </Fragment>
    )
});

export default PlantTree