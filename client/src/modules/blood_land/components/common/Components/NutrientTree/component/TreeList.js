import React , {Fragment, useState , memo , useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import * as m from '../../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";
import {objectsActions} from "../../../../../../../store/actions/gameActions/objectsActions";
import _ from "lodash"

const itemForTree = 'I01';

const TreeList = memo(props => {
    const dispatch = useDispatch();
    const {settingReducer: {language}, inventoryReducer: {itemInventory}, screens }= useSelector(state => state);
    const [landToUseNutrient, SetLandToUseNutrient] = useState([]);
    const [checkedAll, setCheckedAll] = useState();
    const {lands} = props;
    const nutrient = itemInventory && itemInventory.find(i => i.itemId === itemForTree);
    const usingAmount = landToUseNutrient.length;

    const spacing = <div className='item-row'>
        <div className='tree-col'/>
        <div className='land-col'/>
        <div className='blood-col'/>
        <div className='nutrient1-col'/>
        <div className='nutrient2-col'/>
    </div>;

    const onSaveLandToUseNutrient = (value, status) => {
        const landToUseNutrientClone = _.cloneDeep(landToUseNutrient);
        if (!landToUseNutrientClone.some(l => l._id === value._id) && status) {
            landToUseNutrientClone.push(value)
        }
        if (landToUseNutrientClone.some(l => l._id === value._id) && !status) {
            landToUseNutrientClone.splice(landToUseNutrientClone.findIndex(l => l._id === value._id), 1)
        }
        setCheckedAll(landToUseNutrientClone.length === lands.length)
        SetLandToUseNutrient(landToUseNutrientClone);
        dispatch(objectsActions.getLandToUseNutrient(landToUseNutrientClone))
    };

    const onCheckAll = (e) => {
        setCheckedAll(!checkedAll);
        let landToUseNutrientClone = _.cloneDeep(landToUseNutrient);
        e.target.checked ?  lands.map(l => landToUseNutrientClone.push(l)) :  landToUseNutrientClone = []
        SetLandToUseNutrient(landToUseNutrientClone);
        dispatch(objectsActions.getLandToUseNutrient(landToUseNutrientClone))
    };

    const treeListRender = () => {
        return (
            lands.map((item, index) => {
                // console.log('item',item)
                const {nutritionalEndTime1, nutritionalEndTime2, _id , name , quadKey, profitTotal ,  treeInfo} = item;
                const {nutritionalDayRemaining1, nutritionalDayRemaining2} = m.common.nutritionalDayRemaining({
                    nutritionalEndTime1,
                    nutritionalEndTime2
                });
                return (
                    <div className='item-row' key={index}>
                        <div className='tree-col'>
                            <StyledCheckbox id={_id} value={item}
                                            onChange={(e) => onSaveLandToUseNutrient(e.value, e.target.checked)}
                                            checked={landToUseNutrient.some(l => l._id === _id)}/>
                            <img src={m.getMapImgByItemId(item.itemId)} alt=''/>
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
                        <div className='nutrient1-col'>
                            <input className='left-day' disabled
                                   value={nutritionalEndTime1 ? nutritionalDayRemaining1 : 0}/>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.left'}/>
                        </div>
                        <div className='nutrient2-col'>
                            <input className='left-day' disabled
                                   value={nutritionalEndTime2 ? nutritionalDayRemaining2 : 0}/>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.left'}/>
                        </div>
                    </div>
                )
            })
        )
    };

    return(
        <Fragment>
            <div className='tree-nutrient-container'>
                <div className='header-grid'>
                    <div className='head1-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.select'}/>
                    </div>
                    <div className='head2-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.progress'}/>
                    </div>
                    <div className='tree-sub-col'>
                        <StyledCheckbox onChange={(e) => onCheckAll(e)}
                                        checked={checkedAll}/>
                        <span>&nbsp; <m.TranslateLanguage
                            direct={'menuTab.myLand.landOwned.nutrient.selectAll'}/></span>
                        {/*<div> &nbsp; {`( ${lands && lands.length} )`} </div>*/}
                    </div>
                    <div className='land-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.location'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.rate'}/>
                    </div>
                    <div className='nutrient-sub-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.nutrientTime'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    {spacing}
                    {!lands ? <div>Loading</div> : treeListRender()}
                </div>
                <div className='footer-grid'>
                    <div className='footer1-col'>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.quantity'}/>
                    </div>
                    <div className='footer2-col'>
                        <div className='value'>{usingAmount}</div>
                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.sprout'}/>
                    </div>
                </div>
            </div>
            <div className='nutrient-item-inventory-container'>
                <div className='header-grid'>
                    <div className='title'>
                        <m.TranslateLanguage
                            direct={'menuTab.myLand.landOwned.nutrient.item'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage
                            direct={'menuTab.myLand.landOwned.nutrient.reserve'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage
                            direct={'menuTab.myLand.landOwned.nutrient.quantityToUse'}/>
                    </div>
                    <div className='title'>
                        <m.TranslateLanguage
                            direct={'menuTab.myLand.landOwned.nutrient.quantityLeft'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    <div className='content'>
                        <div className='sp-item no-hover'>
                            <div className='sp-img'>
                                {<img src={m.getShopThumbnailByItemId(itemForTree)} alt=''/>}
                                {nutrient && nutrient.quantity}
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.times'}/>
                            </div>
                            {nutrient &&
                            <div className='sp-name'>
                                <m.ItemTranslate itemSelected={nutrient} name={true} decoClass='translation'
                                                 language={language}/>
                            </div>}
                        </div>
                    </div>
                    <div className='content'>
                        {/* so luong du tru */}
                        <div className='value'>{nutrient && nutrient.quantity}</div>
                    </div>

                    <div className='content'>
                        {/* so luong muon su dung */}
                        <div className='value'>{nutrient && usingAmount}</div>
                    </div>

                    <div className='content'>
                        {/* so luong con lai */}
                        {nutrient && <div className='value'>{ usingAmount > nutrient.quantity ? 0 : nutrient.quantity - usingAmount}</div>}
                    </div>
                </div>
            </div>
        </Fragment>
    )

});
export default TreeList