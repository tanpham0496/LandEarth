import React from "react"
import classNames from 'classnames';
import { useSelector} from "react-redux";
import MenuMyAccountComponent from "./MenuMyAccount";

//Directory
    // index => MenuIconTabListComponent

const MenuIconTabListComponent = (props) => {

    const {screens} = useSelector(state => state)

    const menuIconTabListContainerClass = classNames({
        'menu-icon-tab-list-container': true,
        'active-friendList': screens['friendList'],
        'active-blockFriend': screens['blockFriend'],
        'active-addFriend': screens['addFriend'],
        'disabled': !screens['friendList'] && !screens['addFriend'] && !screens['blockFriend']
    });
    const iconTabListContainerClass = classNames({
        'icon-tab-list-container': true,
        'disabled': screens['friendList'] || screens['addFriend'] || screens['blockFriend']
    });
    return (
        <div className={menuIconTabListContainerClass}>
            <div className={iconTabListContainerClass}>
                {/*My account*/}
                {screens['myAccount'] && <MenuMyAccountComponent/>}
            </div>
        </div>
    )
};

export default MenuIconTabListComponent
