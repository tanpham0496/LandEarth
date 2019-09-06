import React, {Fragment} from 'react';

import connect from "react-redux/es/connect/connect";
import UserInfo from "../gameUIComponent/UserInfo";
import MyLand from "../gameUIComponent/MyLand";
import Wallet from "./Wallet";
import LandTrading from "../gameUIComponent/LandTrading";
import CharacterInventory from "./InventoryComponent/CharacterInventory";
import ItemsInventory from "./InventoryComponent/ItemsInventory";
import GiftsInventory from "./InventoryComponent/RandomBoxInventory";
import Bitamin from "./Bitamin";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";

function GameTabScreenValueGameUi(props) {
    const screen = {
        noScreen: "noScreen",
        userInfo: "userInfo",
        myland: "myland",
        wallet: "wallet",
        landTrade: "landTrade",
        characterInventory: "characterInventory",
        itemsInventory: "itemsInventory",
        giftInventory: "giftInventory",
        bitamin: 'bitamin',
    };
    const getScreenByValue = (value) => {

        switch (value) {
            case screen.userInfo:
                return <UserInfo/>;
            case screen.landTrade:
                return <LandTrading/>;
            case screen.wallet:
                return <Wallet/>;
            case screen.myland:
                return <MyLand handleShowPopup={null} popupScreen={null}/>;
            case screen.characterInventory:
                return <CharacterInventory handleShowPopup={null}/>;
            case screen.itemsInventory:
                return <ItemsInventory/>;
            case screen.giftInventory:
                return <GiftsInventory/>;
            case screen.bitamin:
                return <Bitamin/>;
            default:
                return '';
        }
    };
    const handleHide = () => {
        props.removePopup({name: 'open'});
        props.removePopup({name: 'gameUIShow'});

        //hide GameTabScreenValueGameUi when right click sellland
        props.removePopup({name: "MyLand"})


    };


    const {currentScreenValue} = props;
    return (
        <Fragment>
            <div className='hide-panel' onClick={() => handleHide()}>
                <div className='hide-icon'/>
            </div>
            {getScreenByValue(currentScreenValue)}
        </Fragment>
    )
}


const mapDispatchToProps = (dispatch) => ({
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

const connectedFunctionPage = connect(null, mapDispatchToProps)(GameTabScreenValueGameUi);
export default connectedFunctionPage;
