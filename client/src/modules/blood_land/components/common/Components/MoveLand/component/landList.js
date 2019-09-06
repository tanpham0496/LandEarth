import React, {Fragment, PureComponent} from 'react'
import {StyledCheckbox} from "../../../../../../../components/customStyled/Checkbox_style";
import {StyledDropdown} from "../../../../../../../components/customStyled/Dropdown_style";
import {connect} from 'react-redux'
import {loadingImage} from "../../../../general/System";
import {TranslateLanguage} from "../../../../../../../helpers/importModule";

class LandList extends PureComponent {
    state = {};


    cateTemplate = (option) => {
        if (!option._id) {
            return option.name;
        } else {
            return (<Fragment>
                <div className='land-name'>{option.name}</div>
                <div className='land-amount'>{option.landCount}</div>
            </Fragment>);
        }
    };

    render() {
        const {categorySelected} = this.state;
        const {selectedLands, onHandleCheckLand, onHandleCheckAll, checkAll, categoryList: {categories}, onHandleCheckMoveLand, categoryId} = this.props;
        const categoriesFilter = categories && categories.filter(c => c._id !== categoryId)
        return (
            <div className='move-land-body'>
                <div className="title-container">
                    <div className='check-all-button'>
                        <StyledCheckbox checked={checkAll}
                                        onChange={(e) => onHandleCheckAll(e)}/>
                    </div>
                    <div className='title'>
                        Selected All
                    </div>
                    {/*<div className='land-selected-number'>*/}
                    {/*    {`( ${selectedLands && selectedLands.length} )`}*/}
                    {/*</div>*/}
                </div>
                <div className='land-list-container'>
                    {selectedLands.map((item, index) => {
                        const {quadKey, name} = item;
                        return (
                            <div className='land-item-container' key={index}>
                                <div className='check-button'>
                                    <StyledCheckbox
                                        checked={item.checked}
                                        value={item} onChange={(e) => onHandleCheckLand(e)}/>
                                </div>
                                <div className='land-name'>{name ? name : quadKey}</div>
                            </div>
                        )
                    })}

                </div>
                <div className='selected-folder-container'>
                    <div className='title'>
                        Selected Folder
                    </div>
                    <div className='selected-folder'>
                        <StyledDropdown optionLabel='name' value={categorySelected} options={categoriesFilter}
                                        itemTemplate={this.cateTemplate}
                                        onChange={(e) => {
                                            this.setState({categorySelected: e.value})
                                        }} placeholder="Select a Category"/>
                    </div>
                </div>
                <div className='button-container'>
                    <div className='button-confirm' onClick={() => {
                        onHandleCheckMoveLand(categorySelected, categories)
                        this.setState({
                            categorySelected: ''
                        })
                    }}>
                        <div className='image-item'>
                            <img src={loadingImage('/images/game-ui/sm-ok.svg')} alt=''/>
                        </div>
                        <div className='item-title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.confirm'}/>
                        </div>
                    </div>
                    <div className='button-cancel' onClick={() => this.props.handleHidePopup()}>
                        <div className='image-item'>
                            <img src={loadingImage('/images/game-ui/sm-close.svg')} alt=''/>
                        </div>
                        <div className='item-title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.cancel'}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {lands: {categoryList}} = state;
    return {
        categoryList
    }
};

export default connect(mapStateToProps, null)(LandList)