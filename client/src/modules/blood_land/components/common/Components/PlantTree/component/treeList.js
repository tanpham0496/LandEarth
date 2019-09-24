import React, {PureComponent} from 'react'
import {getMapImgByItemId} from "../../../../../../../helpers/thumbnails";
import ItemTranslate from "../../../../general/ItemTranslate";
import {connect} from 'react-redux'
import {
    screenActions,
    TranslateLanguage,
} from '../../../../../../../helpers/importModule';
class TreeList extends PureComponent {
    state = {};

    onHandleSimulatePlantTree = (treeSelected, landsSelected) => {
        const {tree: {itemId} , remainAmount} = treeSelected;
        const { onSimulatePlantTree , addPopup} = this.props;
        if(!landsSelected || (landsSelected && landsSelected.length === 0) ){
            addPopup({name: 'NoSelectedAlert'})
        }else if(remainAmount === 0){
           addPopup({name: 'NotEnoughAmountAlert'})
        }
        else {
            onSimulatePlantTree(itemId)
        }
    };
    render() {
        const {treeList , settingReducer: {language }, selectedLands } = this.props;
        const allTreeSort = treeList.filter(t => t.tree.itemId !== 'T10').sort((a, b) => {
            return a.tree.price - b.tree.price
        });
        return (
            <div className='plant-simulation-list list-scrollable' style={{paddingTop: '15px', height: '173px',border:'none'}}>
                <div className='title-plan-tree-container'>
                    <div className='tree-row-title'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.item'}/>
                    </div>
                    <div className='tree-available-title'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.reserveQuantity'}/>
                    </div>
                    <div className='using-tree-title'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.quantityToUse'}/>
                    </div>
                    <div className='rest-tree-title'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.quantityLeft'}/>
                    </div>
                </div>
                {
                    allTreeSort.map((item, index) => {
                        const { maxAmount, usingAmount, remainAmount , tree} = item;
                        return (
                            <div className='item no-content' key={index} style={{justifyContent: 'center'}}>
                                <div className='i-30 text-center' onClick={() => this.onHandleSimulatePlantTree(item, selectedLands)}>
                                    <button className='sp-item'>
                                        <div className='sp-img'><img src={getMapImgByItemId(tree.itemId)} alt={`itemId`} /></div>
                                        {tree &&<div className='sp-name'><ItemTranslate itemSelected={tree} name={true} decoClass='translation' language={language} /></div>}
                                    </button>
                                </div>
                                <div className='i-60 text-center'>
                                    <div className='inputs-group'>
                                        <div className='textinput'>
                                            <input readOnly value={maxAmount}/>
                                        </div>
                                        <div className='textinput'>
                                            <input readOnly value={usingAmount}/>
                                        </div>
                                        <div className='textinput'>
                                            <input readOnly value={remainAmount}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const {settingReducer} = state;
    return {settingReducer};
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: screen => dispatch(screenActions.addPopup(screen))
});
export default connect(mapStateToProps , mapDispatchToProps)(TreeList)