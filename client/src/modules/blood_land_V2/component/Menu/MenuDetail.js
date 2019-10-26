import React, {Fragment} from 'react'
import {useSelector} from "react-redux";
import classNames from 'classnames';
import FriendComponent from "../Friend";
import MailComponent from "../Mail";

//Directory
    // index => MenuDetailComponent

const MenuDetailComponent = () => {
    const {screens} = useSelector(state =>  state);
    const MenuMyAccountClass = classNames({
        'menu-detail-container ': true,
        'active-friendList': screens['friendList'],
        'active-addFriend': screens['addFriend'],
        'active-blockFriend': screens['blockFriend'],
        'active-receiveMail': screens['receiveMail'],
        'active-readMail': screens['readMail'],
        'active-sendMail': screens['sendMail'],
        'disabled': !screens['friendList'] && !screens['addFriend'] && !screens['blockFriend'] &&  !screens['receiveMail'] && !screens['readMail'] && !screens['sendMail']
    });

    return(
        <Fragment>
            {screens['myAccount'] &&  <div className={MenuMyAccountClass}>
                <FriendComponent/>
                {/*{screens['friendList'] && <FriendComponent/>}*/}
                <MailComponent/>
            </div>}
           

        </Fragment>

    )
};
export default MenuDetailComponent
