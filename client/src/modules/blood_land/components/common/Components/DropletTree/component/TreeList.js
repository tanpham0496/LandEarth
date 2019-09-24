import React, {Fragment, useState} from 'react';
import { useDispatch, useSelector} from 'react-redux'
import * as m from '../../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";
import {objectsActions} from "../../../../../../../store/actions/gameActions/objectsActions";
import _ from 'lodash'

const itemForTree = 'I03';

const TreeList = (props) => {
    const dispatch = useDispatch();
    const {inventoryReducer: {itemInventory}, settingReducer: {language}} = useSelector(state => state);
    const {lands} = props;
    const [landToUseWater, SetLandToUseWater] = useState([]);
    const [checkedAll, setCheckedAll] = useState();
    const water = itemInventory && itemInventory.find(i => i.itemId === itemForTree);

    const usingAmount = landToUseWater.length;
    const spacing = <div className='item-row'>
        <div className='tree-col'/>
        <div className='blood-col'/>
        <div className='land-col'/>
        <div className='water-col'/>
    </div>;

    const onSaveLandUseWater = (value, status) => {
        const landToUseWaterCLone = _.cloneDeep(landToUseWater);
        if (!landToUseWaterCLone.some(l => l._id === value._id) && status) {
            landToUseWaterCLone.push(value)
        }
        if (landToUseWaterCLone.some(l => l._id === value._id) && !status) {
            landToUseWaterCLone.splice(landToUseWater.findIndex(l => l._id === value._id), 1)
        }
        setCheckedAll(landToUseWaterCLone.length === lands.length)
        SetLandToUseWater(landToUseWaterCLone);
        dispatch(objectsActions.getLandToUseWater(landToUseWaterCLone))
    };

    const onCheckAll = (e) => {
        setCheckedAll(!checkedAll);
        let landToUseWaterCLone = _.cloneDeep(landToUseWater);
        e.target.checked ?  lands.map(l => landToUseWaterCLone.push(l)) :  landToUseWaterCLone = []
        SetLandToUseWater(landToUseWaterCLone)
        dispatch(objectsActions.getLandToUseWater(landToUseWaterCLone))
    };
    const treeListRender = () => {
        return (
            lands.map((item, index) => {
                const {name, quadKey, itemId, waterEndTime, profitTotal, _id , treeInfo} = item;
                return (
                    <div className='item-row' key={index}>
                        <div className='tree-col'>
                            <StyledCheckbox style={{marginTop: '-1px'}} id={_id} value={item}
                                            onChange={(e) => onSaveLandUseWater(e.value, e.target.checked)}
                                            checked={landToUseWater.some(l => l._id === _id)}/>
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
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.left'}/>
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
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.landSelected'}/>
                    </div>
                    <div className='head2-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.progressRate'}/>
                    </div>
                    <div className='tree-sub-col'>
                        <StyledCheckbox  onChange={(e) => onCheckAll(e)}
                                          checked={checkedAll}/>
                        {/*<div className={checkAllClass} onClick={() => this.clickCheckAll()}/>*/}
                        <span>&nbsp;
                            <m.TranslateLanguage
                                direct={'menuTab.myLand.landOwned.water.selectAll'}/></span>
                        {/*<div> &nbsp; {`( ${lands && lands.length} )`} </div>*/}
                    </div>
                    <div className='land-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.location'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.interest'}/>
                    </div>
                    <div className='water-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.waterTime'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    {spacing}
                    {!lands ? <div>Loading</div> : treeListRender()}
                </div>
                <div className='footer-grid'>
                    <div className='footer1-col'>
                        <div className='droplet-item no-hover'>
                            <div className='sp-img'>
                                <img src={m.getShopThumbnailByItemId(itemForTree)} alt=''/>
                                {water && <m.ItemTranslate itemSelected={water} name={true} decoClass='translation'
                                                           language={language}/>}
                            </div>
                        </div>
                    </div>
                    <div className='footer2-col'>
                        <div className='value'>{usingAmount}</div>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.tree'}/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};
export default TreeList