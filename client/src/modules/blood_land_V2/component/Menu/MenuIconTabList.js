import React, {Fragment} from "react"
import classNames from 'classnames';
import {useSelector} from "react-redux";
import MenuMyAccountComponent from "./MenuMyAccount";
import WareHouse from "../WareHouse/WareHouse";
import SearchingComponent from "../Searching/Searching";
import MenuMyLand from "./MenuMyLand";

//Directory
// index => MenuIconTabListComponent

const MenuIconTabListComponent = (props) => {

    const {screens} = useSelector(state => state)

    const menuIconTabListContainerClassMyAccount = classNames({
        'menu-icon-tab-list-container': true,
        'active-friendList': screens['friendList'],
        'active-blockFriend': screens['blockFriend'],
        'active-addFriend': screens['addFriend'],
        'active-receiveMail': screens['receiveMail'],
        'active-readMail': screens['readMail'],
        'active-sendMail': screens['sendMail'],
        'active-reserve' : screens['Reserve'],
        'active-land-for-sale' : screens['LandForSale'],
        'active-land-registered' : screens['RegisteredLand'],
        'active-searching' : screens['searching'],
        'active-wareHouse' : screens['wareHouse'],
        'disabled': !screens['friendList'] && !screens['addFriend'] && !screens['blockFriend'] && !screens['receiveMail'] && !screens['readMail']
            && !screens['sendMail'] && !screens['Reserve'] && !screens['LandForSale'] && !screens['RegisteredLand'] && !screens['searching'] && !screens['wareHouse'],
        'hidden' : screens['game'] || screens['setting'],
        'myLandClass' : screens['myLand']
    });
    const iconTabListContainerClass = classNames({
        'icon-tab-list-container': true,
        'disabled': screens['friendList'] || screens['addFriend'] || screens['blockFriend'] || screens['receiveMail'] || screens['readMail'] || screens['sendMail']
        || screens['Reserve'] ||  screens['LandForSale'] || screens['RegisteredLand']
    });
    
    return (
        <Fragment >
            <div className={menuIconTabListContainerClassMyAccount}>
                <div className={iconTabListContainerClass}>
                    {/*My account*/}
                    {screens['myAccount'] && <MenuMyAccountComponent/>}
                    {screens['myLand']    && <MenuMyLand/>}
                    {screens['wareHouse'] &&  <WareHouse/>}
                    {screens['searching'] &&  <SearchingComponent/>}
                </div>
            </div>
        </Fragment>

    )
};

export default MenuIconTabListComponent
