import React, {Fragment} from "react"
import classNames from 'classnames';
import {useSelector} from "react-redux";
import MenuMyAccountComponent from "./MenuMyAccount";
import WareHouse from "../WareHouse/WareHouse";
import SearchingComponent from "../Searching/Searching";

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
        'disabled': !screens['friendList'] && !screens['addFriend'] && !screens['blockFriend'] && !screens['receiveMail'] && !screens['readMail']
            && !screens['sendMail'],
        'hidden' : screens['game'],
    });
    const iconTabListContainerClass = classNames({
        'icon-tab-list-container': true,
        'disabled': screens['friendList'] || screens['addFriend'] || screens['blockFriend'] || screens['receiveMail'] || screens['readMail'] || screens['sendMail']
    });
    return (
        <Fragment >
            <div className={menuIconTabListContainerClassMyAccount}>
                <div className={iconTabListContainerClass}>
                    {/*My account*/}
                    {screens['myAccount'] && <MenuMyAccountComponent/>}
                    {screens['wareHouse'] &&  <WareHouse/>}
                    {screens['searching'] &&  <SearchingComponent/>}
                </div>
            </div>
        </Fragment>

    )
};

export default MenuIconTabListComponent
