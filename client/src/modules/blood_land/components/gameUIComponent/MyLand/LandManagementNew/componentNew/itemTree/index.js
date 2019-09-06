import React, {Fragment, PureComponent , lazy , Suspense } from 'react'
import {connect} from 'react-redux'
import {loadingImage, screenActions, TranslateLanguage} from "../../../../../../../../helpers/importModule";
import * as alertS from "../../../../../common/Components/SellLand/component/alertPopup";
import Tooltip from "../../../../../general/Tooltip";
import NoSelectedAlert from "../../../../../common/Popups/commomPopups/NoSelectedAlert"
import ExistTreeAlert from "../../../../../common/Popups/GameMapPopups/ExistTreeAlert";
import PlantTreeBeforeNutrientAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeNutrientAlert";
import PlantTreeBeforeShovelAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeShovelAlert";
import PlantTreeBeforeDropletAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeDropletAlert";
import UseLimitedItemAlert from "../../../../../common/Popups/GameMapPopups/UseLimitedItemAlert";
import CheckForSaleStatusAlertForItemPopup from "../../../../../common/Popups/GameMapPopups/CheckForSaleStatusAlertForItemPopup";
import {loadingComponent} from "../../../../../common/Components/CommonScreen"
import LandHaveBTaminAlert from "../../../../../common/Popups/commomPopups/LandHaveBTaminAlert";


const PlantTree = lazy(() => import("../../../../../common/Components/PlantTree"));
const Nutrient = lazy(() => import("../../../../../common/Components/NutrientTree"));
const RemoveTree = lazy(() => import("../../../../../common/Components/RemoveTree"));
const Droplet = lazy(() => import("../../../../../common/Components/DropletTree"));
const SellLand = lazy(() => import("../../../../../common/Components/SellLand"));

const ItemList = [
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-medic.png'),
        type: 'nutrient'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-shovel.png'),
        type: 'shovel'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.water'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-water.png'),
        type: 'water'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.tree'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-tree.png'),
        type: 'plant'
    },
];



const {...aS} = alertS.alertPopupSellLand;



class ItemTree extends PureComponent {
    state = {};
    onHandleShowPopup = (currentPopupScreen) => {
        this.setState({
            currentPopup: currentPopupScreen
        })
    };

    //close popup
    onHandleHidePopup = () => {
        this.setState({
            currentPopup: 'noPopup'
        })
    };

    gotoSellLand = () => {
        this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.landSale);
    };

    toolTipItemRender = (type) => {
        let renderLabel = '';
        switch (type) {
            case 'nutrition':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.nutritionButton'}/>;
                break;
            case 'shovel':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.shovelButton'}/>;
                break;
            case 'smallWater':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.dropletButton'}/>;
                break;
            case  'cultivation':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.cultivationButton'}/>;
                break;
            default:
                break;
        }
        return renderLabel;
    };
    //render item for tree screen
    onHandleRenderItemForTreeFunction = (categoryId) => {
        const {screens} = this.props;
        return (
            <Fragment>
                {screens['plant'] && <PlantTree/>}
                {screens['nutrient'] && <Nutrient />}
                {screens['shovel'] && <RemoveTree />}
                {screens['water'] && <Droplet />}
                {/*{screens['sellLand'] && <SellLand gotoSellLand={this.gotoSellLand} categoryId={categoryId} selectedLands={landCheckingSelected}/>}*/}
                {/*{screens['moveLand'] && <MoveLand changeCheckStatus={changeCheckStatus} selectedLands={landCheckingSelected}/>}*/}
            </Fragment>
        )
    };
    //render popup
    onHandlePopupRender = () => {
        const {currentPopup} = this.state;
        const {screens} = this.props;


        const getAlertCannotSellStatus = currentPopup === aS.getCannotSellLandAlertPopup;
        const getLandAlreadySalePopupStatus = currentPopup === aS.landAlreadySell;

        return (
            <Fragment>
                {screens["NoSelectedAlert"] && <NoSelectedAlert/>}
                {screens["ExistTreeAlert"] && <ExistTreeAlert/>}

                {screens["PlantTreeBeforeNutrientAlert"] && <PlantTreeBeforeNutrientAlert/>}
                {screens["PlantTreeBeforeShovelAlert"] && <PlantTreeBeforeShovelAlert/>}
                {screens["PlantTreeBeforeDropletAlert"] && <PlantTreeBeforeDropletAlert/>}
                {screens["UseLimitedItemAlert"] && <UseLimitedItemAlert isOpenCultivationPopup={false}/>}
                {screens["LandHaveBTaminAlert"] && <LandHaveBTaminAlert/>}
                {getAlertCannotSellStatus && alertS.getCannotSellLandAlertPopup(getAlertCannotSellStatus, this.onHandleHidePopup)}
                {getLandAlreadySalePopupStatus && alertS.getLandAlreadySellAlertPopup(getLandAlreadySalePopupStatus, this.onHandleHidePopup)}


                {screens["CheckForSaleStatusAlertForItemPopup"] && <CheckForSaleStatusAlertForItemPopup/>}
                {/*{<LoadingPopup/>}*/}
            </Fragment>
        )
    };

    render() {
        const {currentCategoryId , onHandleUsingItem} = this.props;
        return (
            <Fragment>
                {ItemList.map((value, index) => {
                    const {image, name, type} = value;
                    return (
                        <div className='item-button' key={index} onClick={() => onHandleUsingItem(type)}>
                            <div className='image-container'>
                                <img src={image} alt={name}/>
                            </div>
                            <span>{value.name}</span>
                            <div className='tool-tip-item'>
                                {this.toolTipItemRender(type)}
                            </div>
                        </div>
                    )
                })}
                {/*alert popup render*/}
                {this.onHandlePopupRender()}

                {/*//item for tree render*/}
                <Suspense fallback={loadingComponent()}>
                    {this.onHandleRenderItemForTreeFunction(currentCategoryId)}
                </Suspense>

            </Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    const {screens} = state;
    return {screens}
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen))
});
export default connect(mapStateToProps, mapDispatchToProps)(ItemTree)