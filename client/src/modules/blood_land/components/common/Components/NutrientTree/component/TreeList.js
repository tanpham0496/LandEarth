import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux'
import * as m from '../../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";

const itemForTree = 'I01';

class TreeList extends PureComponent {

    treeListRender = (lands) => {
        const {settingReducer: {language}, clickCheckbox} = this.props;
        return (
            lands.map((item, index) => {
                console.log('item',item)
                const {nutritionalEndTime1, nutritionalEndTime2} = item.tree;
                //console.log('nutritionalEndTime1, nutritionalEndTime2', nutritionalEndTime1, nutritionalEndTime2);
                const {nutritionalDayRemaining1, nutritionalDayRemaining2} = m.common.nutritionalDayRemaining({
                    nutritionalEndTime1,
                    nutritionalEndTime2
                });
                return (
                    <div className='item-row' key={index}>
                        <div className='tree-col'>
                            <StyledCheckbox  value={item} onChange={(e) => clickCheckbox(e)}
                                             checked={item.checked}/>
                            <img src={m.getMapImgByItemId(item.tree.itemId)} alt=''/>
                            <span onClick={() => clickCheckbox(item)}><m.ItemTranslate
                                itemSelected={item.treeInfo} name={true} decoClass='translation'
                                language={language}/></span>
                        </div>
                        <div className='land-col'>
                            {item.name ? item.name : item.quadKey}
                        </div>
                        <div className='blood-col'>
                            {item.tree ? item.tree.profitTotal.toFixed(6) + '%' : '0%'}
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

    render() {
        const {lands, settingReducer: {language}, inventoryReducer: {itemInventory}, onHandleCheckAll , checkAll} = this.props;
        const usingAmount = lands && lands.filter(l => l.checked).length;
        const nutrient = itemInventory && itemInventory.find(i => i.itemId === itemForTree);
        const spacing = <div className='item-row'>
            <div className='tree-col'/>
            <div className='blood-col'/>
            <div className='land-col'/>
            <div className='nutrient1-col'/>
            <div className='nutrient2-col'/>
        </div>;
        return (
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
                            <StyledCheckbox  onChange={(e) => onHandleCheckAll(e)}
                                             checked={checkAll}/>
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
                        {!lands ? <div>Loading</div> : this.treeListRender(lands)}
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
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, inventoryReducer, } = state;
    return {
        settingReducer, inventoryReducer
    }
};

export default connect(mapStateToProps)(TreeList)