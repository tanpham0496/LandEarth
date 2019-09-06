import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux'
import * as m from '../../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";

const itemForTree = 'I03';

class TreeList extends PureComponent {
    treeListRender = (lands) => {
        const {settingReducer: {language}, clickCheckbox} = this.props;
        return (
            lands.map((item, index) => {
                return (
                    <div className='item-row' key={index}>
                        <div className='tree-col'>
                            <StyledCheckbox  style={{marginTop: '-1px'}} value={item} onChange={(e) => clickCheckbox(e)}
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
                        <div className='water-col'>
                            <input className='water-left-day' disabled
                                   value={m.common.waterLeftDay(item.tree.waterEndTime)}/>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.left'}/>
                        </div>
                    </div>
                )
            })
        )
    };

    render() {
        const {lands, settingReducer: {language}, inventoryReducer: {itemInventory} , onHandleCheckAll , checkAll} = this.props;
        const usingAmount = lands && lands.filter(l => l.checked).length;
        const water = itemInventory && itemInventory.find(i => i.itemId === itemForTree);
        const spacing = <div className='item-row'>
            <div className='tree-col'/>
            <div className='blood-col'/>
            <div className='land-col'/>
            <div className='water-col'/>
        </div>;
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
                            <StyledCheckbox   onChange={(e) => onHandleCheckAll(e)}
                                             checked={checkAll}/>
                            {/*<div className={checkAllClass} onClick={() => this.clickCheckAll()}/>*/}
                            <span>&nbsp; <m.TranslateLanguage
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
                        {!lands ? <div>Loading</div> : this.treeListRender(lands)}
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
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, inventoryReducer, } = state;
    return {
        settingReducer, inventoryReducer
    }
};

const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TreeList)