import React , {PureComponent} from 'react'
import {TranslateLanguage} from "../../../../../../../helpers/importModule";
import {StyledCheckbox2} from "../../../../../../../components/customStyled/Checkbox2_style";
const maxPrice = 999999999;
class LandList extends PureComponent{
    state = {
        priceAll: 0
    };

    onHandleChangeAll = (e) => {
        const priceAll = parseInt(e.target.value , 10);
        if(priceAll <= maxPrice && priceAll >= 0){
            this.setState({
                priceAll
            });
            this.props.onHandleChangePriceAll(priceAll)
        }

    };

    landListRender = () => {
        const {selectedLands, onHandleChangePriceOne , onHandleCheckLand} = this.props;
        return(
            <div className='body-grid'>
                <div className='item-row'><div className='land-col'/><div className='blood-col'/></div>
                {
                    selectedLands.map((landItem , index) => {
                        return(
                            <div className='item-row' key={index}>
                                <div className='land-col'>
                                    {/*<div className={checkBoxClass} onClick={() => onHandleCheckLand(landItem) }/>*/}
                                    <StyledCheckbox2
                                        checked={landItem.checked}
                                        value={landItem} onChange={() => onHandleCheckLand(landItem)}/>
                                    <span>{landItem.name ? landItem.name : landItem.quadKey}</span>
                                </div>
                                <div className='blood-col'>
                                    <input type='number'
                                           onChange={(e) => onHandleChangePriceOne(e, landItem)}
                                           value={landItem.sellPrice}
                                    /> Blood
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    render() {
        const {selectedLands , onHandleCheckAll , checkAll} = this.props;
        const {priceAll} = this.state;
        const selectedLandLength = selectedLands && selectedLands.filter(landItem => landItem.checked).length;
        return (
            <div className='sell--land-container'>
                <div className='header-grid'>
                    <div className='land-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.selectLand'}/></div>
                    <div className='blood-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.salePrice'}/></div>
                    <div className='land-sub-col'>
                        <StyledCheckbox2 checked={checkAll}
                                        onChange={(e) => onHandleCheckAll(e)}/>
                        <span style={{paddingLeft : '5px'}}><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.selectAll'}/></span>
                        {/*<div > &nbsp;{`(${ (Array.isArray(sellLand) && sellLand.length) || 0 })`} </div>*/}
                    </div>
                    <div className='blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.amount'}/>
                        {/*<input type='number' onChange={(e) => this.changePriceAll(e)} value={sellPrice} /> Blood*/}
                        <input type='number' onChange={(e) => this.onHandleChangeAll(e)} value={priceAll} minLength="0"/> &nbsp; Blood
                    </div>
                </div>
                {this.landListRender()}

            </div>
        );
    }
}
export default LandList