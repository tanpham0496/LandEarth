import React, {Fragment} from 'react'
import {useSelector} from "react-redux";
import classNames from 'classnames';
import FriendComponent from "../Friend";

//Directory
    // index => MenuDetailComponent

const MenuDetailComponent = () => {
    const {screens} = useSelector(state =>  state);
    const MenuMyAccountClass = classNames({
        'menu-detail-container ': true,
        'active-friendList': screens['friendList'],
        'active-addFriend': screens['addFriend'],
        'active-blockFriend': screens['blockFriend'],
        'disabled': !screens['friendList'] && !screens['addFriend'] && !screens['blockFriend']
    });

    return(
        <Fragment>
            {screens['myAccount'] &&  <div className={MenuMyAccountClass}>
                <FriendComponent/>
                {/*{screens['friendList'] && <FriendComponent/>}*/}
            </div>}

        </Fragment>

    )
};
export default MenuDetailComponent
