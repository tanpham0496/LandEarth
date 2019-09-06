import React , {PureComponent }from "react";
import CloneDeep  from 'lodash.clonedeep';
import {
    common,
    getMapImgByItemId,
    TranslateLanguage,
    ItemTranslate, objectsActions,
} from '../../../../../../../helpers/importModule';
import {connect} from 'react-redux'
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";

class TreePlanted extends PureComponent {
    state = {};


    clickCheckbox = (e) => {
        this.setState({
            [e.target.id]: e.checked
        });
        this.props.getLandToPlantTree({value: e.value , status: e.checked})
    };
    onHandleAllChange = (e) => {
        const {onHandleGetTreePlanted ,  lands} = this.props;
        const landsUpdate = CloneDeep(lands);
        landsUpdate.map(l => l.checked = e.checked);
        this.setState({
            checkAll: e.checked
        });
        onHandleGetTreePlanted(landsUpdate)
    };
    treePlantedRender = (lands) => {
        // console.log('lands', lands)
        const spacing = <div className='item-row'><div className='tree-col'/><div className='blood-col'/><div className='land-col' /><div className='water-col' /></div>;
        const {settingReducer: {language}} = this.props;
        const {checkAll} = this.state;
        return (
            <div className='tree-cultivate-container'>
                <div className='header-grid'>
                    <div className='head1-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.landSelected'}/>
                    </div>
                    <div className='head2-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.progressRate'}/>
                    </div>

                    <div className='tree-sub-col'>
                        <StyledCheckbox onChange={(e) => this.onHandleAllChange(e)} checked={checkAll}/>
                        <span><TranslateLanguage direct={'menuTab.myLand.landOwned.tree.selectAll'}/></span>
                        {/*<div > &nbsp;{`(${ (Array.isArray(lands) && lands.length) || 0 })`} </div>*/}
                    </div>
                    <div className='land-sub-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.location'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.interest'}/>
                    </div>
                    <div className='water-sub-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.waterTime'}/>
                    </div>
                </div>
                <div className='body-grid'>
                    {spacing}
                    {
                        lands.map((item, index) => {
                            const {quadKey , treePlanted , name , _id} = item;
                            return (
                                <div className='item-row' key={index}>
                                    <div className='tree-col'>
                                        <StyledCheckbox id={_id} value={item} onChange={(e) => this.clickCheckbox(e)}
                                                         checked={this.state[_id]}/>
                                        <div className='signal-tree'>
                                            {treePlanted && <img src={getMapImgByItemId(treePlanted.itemId)} alt=''/>}
                                        </div>
                                        <span onClick={() => this.clickCheckbox(item)} >
                                            {treePlanted ? <ItemTranslate itemSelected={item.treePlanted} name={true} decoClass='translation'  language={language} /> : '...'}
                                        </span>
                                    </div>
                                    <div className='land-col'>
                                        {name ? name : quadKey}
                                    </div>
                                    <div className='blood-col'>
                                        {item.treePlanted ? item.treePlanted.defaultProfit + '%' : '0%'}
                                    </div>
                                    <div className='water-col'>
                                        <input className='water-left-day' disabled value={item.treePlanted ? `${common.getDefaultWaterLeftDay()}` : '...'}/>
                                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.left'}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='footer-grid'>
                    <div className='footer1-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.landQuantity'}/>
                    </div>
                    <div className='footer2-col'>
                        <div className='value'>{lands.filter(l => l.checked).length}</div>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.land'}/>
                    </div>
                </div>
            </div>
        )
    };
    render() {
        const {lands} = this.props;
        return (
            !lands ? <div>Loading</div> : this.treePlantedRender(lands)
        );
    }
}
const mapStateToProps = (state) => {
    const {settingReducer} = state;
    return {settingReducer};
};
const mapDispatchToProps = (dispatch) => ({
    getLandToPlantTree: (param) => dispatch(objectsActions.getLandToPlantTree(param))
})
export default  connect(mapStateToProps , mapDispatchToProps)(TreePlanted)
