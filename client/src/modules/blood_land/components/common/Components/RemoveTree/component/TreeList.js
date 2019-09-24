import React, {Fragment, useState, memo , useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import * as m from '../../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";
import _ from 'lodash'
import {objectsActions} from "../../../../../../../helpers/importModule";

const itemForTree = 'I02';

const TreeList = memo((props) => {
    const dispatch = useDispatch();
    const [landToRemoveTree, SetLandToRemoveTree] = useState([]);
    const [checkedAll, setCheckedAll] = useState();
    const {settingReducer: {language}, inventoryReducer: {itemInventory}, screens} = useSelector(state => state);
    const {lands} = props;
    const usingAmount = landToRemoveTree.length;
    const shovel = itemInventory && itemInventory.find(i => i.itemId === itemForTree);
    const spacing = <div className='item-row'>
        <div className='tree-col'/>
        <div className='blood-col'/>
        <div className='land-col'/>
        <div className='water-col'/>
    </div>;

    useEffect(() => {
        if(screens['UsingShovelSuccessAlert'] || screens['UsingShovelFailureAlert']) {
            SetLandToRemoveTree([])
        }
    }, [screens]);

    const onSaveLandToRemoveTree = (value, status) => {
        const landToRemoveTreeCLone = _.cloneDeep(landToRemoveTree);
        if (!landToRemoveTreeCLone.some(l => l._id === value._id) && status) {
            landToRemoveTreeCLone.push(value)
        }
        if (landToRemoveTreeCLone.some(l => l._id === value._id) && !status) {
            landToRemoveTreeCLone.splice(landToRemoveTree.findIndex(l => l._id === value._id), 1)
        }
        setCheckedAll(landToRemoveTreeCLone.length === lands.length);
        SetLandToRemoveTree(landToRemoveTreeCLone);
        dispatch(objectsActions.getLandToRemoveTree(landToRemoveTreeCLone))
    };

    const onCheckAll = (e) => {
        setCheckedAll(!checkedAll);
        let landToRemoveTreeCLone = _.cloneDeep(landToRemoveTree);
        e.target.checked ?  lands.map(l => landToRemoveTreeCLone.push(l)) :  landToRemoveTreeCLone = []
        SetLandToRemoveTree(landToRemoveTreeCLone)
        dispatch(objectsActions.getLandToRemoveTree(landToRemoveTreeCLone))
    };

    const treeListRender = () => {
        return (
            lands && lands.map((item, index) => {
                const {_id, itemId, name, quadKey, profitTotal, waterEndTime, treeInfo} = item;
                return (
                    <div className='item-row' key={index}>
                        <div className='tree-col'>
                            <StyledCheckbox id={_id} value={item}
                                            onChange={(e) => onSaveLandToRemoveTree(e.value, e.target.checked)}
                                            checked={landToRemoveTree.some(l => l._id === _id)}/>
                            <img src={m.getMapImgByItemId(itemId)} alt=''/>
                            {treeInfo && <span><m.ItemTranslate
                                itemSelected={treeInfo} name={true} decoClass='translation'
                                language={language}/></span>}
                        </div>
                        <div className='land-col'>
                            {name ? name : quadKey}
                        </div>
                        <div className='blood-col'>
                            {profitTotal ? profitTotal.toFixed(6) + '%' : '0%'}
                        </div>
                        <div className='water-col'>
                            <input className='water-left-day' disabled
                                   value={m.common.waterLeftDay(waterEndTime)}/>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.left'}/>
                        </div>
                    </div>
                )
            })
        )
    };

    return (
        <Fragment>
            <div className='remove-tree-container'>
                <div className='header-grid'>
                    <div className='head1-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.landSelected'}/>
                    </div>
                    <div className='head2-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.progressRate'}/>
                    </div>
                    <div className='tree-sub-col'>
                        <StyledCheckbox
                            onChange={(e) => onCheckAll(e)}
                            checked={checkedAll}/>
                        <span>&nbsp;
                            <m.TranslateLanguage
                                direct={'menuTab.myLand.landOwned.shovel.selectAll'}/></span>
                        {/*<div> &nbsp; {`( ${lands && lands.length} )`} </div>*/}
                    </div>
                    <div className='land-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.location'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.interestRate'}/>
                    </div>
                    <div className='water-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.waterTime'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    {spacing}
                    {!lands ? <div>Loading</div> : treeListRender()}
                </div>
                <div className='footer-grid'>
                    <div className='footer1-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantity'}/>
                    </div>
                    <div className='footer2-col'>
                        <div className='value'>{usingAmount}</div>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.tree'}/>
                    </div>
                </div>
            </div>
            <div className='remove-item-inventory-container'>
                <div className='header-grid'>
                    <div className='title'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.item'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.reserve'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantityUsed'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantityLeft'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    <div className='content'>
                        <div className='sp-item no-hover'>
                            <div className='sp-img'>
                                {<img src={m.getShopThumbnailByItemId(itemForTree)} alt=''/>}
                                {shovel && shovel.quantity}
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.times'}/>
                            </div>
                            {shovel &&
                            <div className='sp-name'>
                                <m.ItemTranslate itemSelected={shovel} name={true} decoClass='translation'
                                                 language={language}/>
                            </div>}
                        </div>
                    </div>
                    <div className='content'>
                        {/* so luong du tru */}
                        <div className='value'>{shovel && shovel.quantity}</div>
                    </div>


                    <div className='content'>
                        {/* so luong muon su dung */}
                        <div className='value'>{usingAmount}</div>
                    </div>

                    <div className='content'>
                        {/* so luong con lai */}
                        {shovel && <div
                            className='value'>{usingAmount > shovel.quantity ? 0 : shovel.quantity - usingAmount}</div>}
                    </div>
                </div>
            </div>
        </Fragment>

    )
});

export default TreeList