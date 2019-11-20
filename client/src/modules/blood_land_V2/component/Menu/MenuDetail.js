import React, {Fragment} from 'react'
import {useSelector} from "react-redux";
import classNames from 'classnames';
import FriendComponent from "../Friend";
import MailComponent from "../Mail";
import ReserveComponent from "../MyLand/Reserve/Reserve";
import LandForSaleComponent from "../MyLand/LandForSale/LandForSaleComponent";
import RegisteredComponent from "../MyLand/Registered/RegisteredComponent";

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
    const MenuMyLandClass = classNames({
        'menu-detail-container': true,
        'active-reserve' : screens['Reserve'],
        'active-land-for-sale' : screens['LandForSale'],
        'active-land-registered' : screens['RegisteredLand'],
        'disabled': !screens['Reserve'] && !screens['LandForSale'] && !screens['RegisteredLand']
    });

    return(
        <Fragment>
            {screens['myAccount'] &&  <div className={MenuMyAccountClass}>
                <FriendComponent/>
                {/*{screens['friendList'] && <FriendComponent/>}*/}
                <MailComponent/>
            </div>}
            {screens['myLand'] &&  <div className={MenuMyLandClass}>
                {screens['Reserve'] && <ReserveComponent />  }
                {screens['LandForSale'] && <LandForSaleComponent />}
                {screens['RegisteredLand'] && <RegisteredComponent />}
            </div>}
           

        </Fragment>

    )
};
export default MenuDetailComponent
