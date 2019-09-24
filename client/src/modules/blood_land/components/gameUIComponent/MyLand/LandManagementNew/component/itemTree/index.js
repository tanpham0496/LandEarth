import React, {Fragment, lazy , Suspense } from 'react'
import {useSelector } from 'react-redux'
import {loadingImage, TranslateLanguage} from "../../../../../../../../helpers/importModule";
import Tooltip from "../../../../../general/Tooltip";
import NoSelectedAlert from "../../../../../common/Popups/commomPopups/NoSelectedAlert"
import ExistTreeAlert from "../../../../../common/Popups/GameMapPopups/ExistTreeAlert";
import PlantTreeBeforeNutrientAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeNutrientAlert";
import PlantTreeBeforeShovelAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeShovelAlert";
import PlantTreeBeforeDropletAlert from "../../../../../common/Popups/GameMapPopups/PlantTreeBeforeDropletAlert";
import UseLimitedItemAlert from "../../../../../common/Popups/GameMapPopups/UseLimitedItemAlert";
import CheckForSaleStatusAlertForItemPopup from "../../../../../common/Popups/commomPopups/CheckForSaleStatusAlertForItemPopup";
import {loadingComponent} from "../../../../../common/Components/CommonScreen"
import LandHaveBTaminAlert from "../../../../../common/Popups/commomPopups/LandHaveBTaminAlert";
import CategoryNoLandAlert from "../../../../../common/Popups/commomPopups/CategoryNoLandAlert";


const PlantTree = lazy(() => import("../../../../../common/Components/PlantTree"));
const Nutrient = lazy(() => import("../../../../../common/Components/NutrientTree"));
const RemoveTree = lazy(() => import("../../../../../common/Components/RemoveTree"));
const Droplet = lazy(() => import("../../../../../common/Components/DropletTree"));

const ItemList = [
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-medic.png'),
        type: 'nutrient',
        screen: 'NutrientTree'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-shovel.png'),
        type: 'shovel',
        screen: 'RemoveTree'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.water'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-water.png'),
        type: 'water',
        screen: 'DropletTree'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.tree'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-tree.png'),
        type: 'plant',
        screen: 'PlantTree'
    },
];

const ItemTree = (props) => {
    const {screens} = useSelector(state =>  state);
    const {onHandleUsingItem} = props;


    const toolTipItemRender = (type) => {
        let renderLabel = '';
        switch (type) {
            case 'nutrient':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.nutritionButton'}/>;
                break;
            case 'shovel':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.shovelButton'}/>;
                break;
            case 'water':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.dropletButton'}/>;
                break;
            case 'plant':
                renderLabel = <Tooltip desccategoLang={'menuTab.myLand.landOwned.toolTip.cultivationButton'}/>;
                break;
            default:
                break;
        }
        return renderLabel;
    };

    return(
        <Fragment>
            {ItemList.map((value, index) => {
                const {image, name, type , screen} = value;
                return (
                    <div className='item-button' key={index} onClick={() => onHandleUsingItem(type , screen)}>
                        <div className='image-container'>
                            <img src={image} alt={name}/>
                        </div>
                        <span>{value.name}</span>
                        <div className='tool-tip-item'>
                            {toolTipItemRender(type)}
                        </div>
                    </div>
                )
            })}
            {/*alert popup render*/}
            {screens["NoSelectedAlert"] && <NoSelectedAlert/>}
            {screens['CategoryNoLandAlert'] && <CategoryNoLandAlert/>}
            {screens["ExistTreeAlert"] && <ExistTreeAlert/>}

            {screens["PlantTreeBeforeNutrientAlert"] && <PlantTreeBeforeNutrientAlert/>}
            {screens["PlantTreeBeforeShovelAlert"] && <PlantTreeBeforeShovelAlert/>}
            {screens["PlantTreeBeforeDropletAlert"] && <PlantTreeBeforeDropletAlert/>}
            {screens["UseLimitedItemAlert"] && <UseLimitedItemAlert isOpenCultivationPopup={false}/>}
            {screens["LandHaveBTaminAlert"] && <LandHaveBTaminAlert/>}


            {screens["CheckForSaleStatusAlertForItemPopup"] && <CheckForSaleStatusAlertForItemPopup/>}
            {/*{<LoadingPopup/>}*/}

            {/*//item for tree render*/}
            <Suspense fallback={loadingComponent()}>
                {screens['PlantTree'] && <PlantTree/>}
                {screens['NutrientTree'] && <Nutrient />}
                {screens['RemoveTree'] && <RemoveTree />}
                {screens['DropletTree'] && <Droplet />}
            </Suspense>

        </Fragment>

    )
};


export default ItemTree