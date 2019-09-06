import React, { Fragment, useEffect } from 'react'
import {connect} from 'react-redux';
import moment from 'moment';
import {landActions, screenActions, loadingImage,} from "../../../../../helpers/importModule";

const identityCard = [
    {type: 'minimap-earth', currency: 'Cells'},
    {type: 'blood', currency: 'Blood'},
    {type: 'email', currency: ''},
];

function IdentityCardComponent(props){
    const {user , lands: { myLands } } = props;
    // onClick={() => this.handleChangeScreen(this.screen.default)}
    // 
    useEffect(() => {
        if(props.user && props.user._id) props.getAllLandById(props.user._id);
    }, []);

    const renderValueIdentityCard = (type, user , lands) => {
        const {wallet} = props;
        const goldBlood = wallet && wallet.info && wallet.info.goldBlood ? parseFloat(wallet.info.goldBlood).toLocaleString() : 0;
        switch (type) {
            case 'minimap-earth':
                return lands.length;
            case 'blood':
                return goldBlood; //common.convertLocaleStringToSpecialString(user.goldBlood, 6);
            case 'email':
                return user.email;
            default:
                break;
        }
    };

    return (
        <Fragment>
            <li className='no-hover' onClick={() => props.addPopup({ name: 'NoIdentityCardComponent', close: "IdentityCardComponent" })}
                style={{height: '62px'}}>
                <div className='blooder-id'>
                    <div className='blooder-card-header'>
                        <span className='header-title'>blooder indentity</span>
                    </div>
                    <div className='blooder-card-body'>
                        <div className='avatar-container'>
                            <div className='blooder-avatar'>
                                <img alt='' style={{width: '70%', height: '77%'}}
                                     src={loadingImage('/images/game-ui/no-avatar.png')}/>
                            </div>
                            <div className='blooder-number'>ID</div>
                            <div className='blooder-name'>
                                {user.wId ? user.wId : user.userName}
                            </div>
                        </div>
                        <div className='information-container'>
                            {identityCard.map((item, key) => {
                                const {type, currency} = item;
                                return (
                                    <div className='info-container' key={key}>
                                        <div className='icon'>
                                            <img alt='' style={{width: '13px', marginTop: '6px'}}
                                                 src={loadingImage(`/images/game-ui/${type}.svg`)}/>
                                        </div>
                                        <div className='information'>
                                            <div className='info-detail'>
                                                {renderValueIdentityCard(type, user , myLands)} {currency}
                                            </div>

                                        </div>

                                    </div>
                                )
                            })}
                            <div className='date-container'>
                                <div className='title'>
                                    DATE OF ISSUE
                                </div>

                                <div className='content'>
                                    {myLands &&
                                    <span>
                                        {moment(user.createdDate).format('YYYY.MM.DD')}
                                    </span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='blooder-card-footer'>
                        <span className='footer-title'>www.blood.land</span>
                    </div>
                </div>
            </li>
        </Fragment>
    )
};

export default connect(
    state => {
        const { authentication: { user }, screens, lands, wallet /*, map, alert, users, settings, lands, lands: { myLands }*/ } = state;
        return { user, screens, lands, wallet /*, alert, lands, map, users, settings, myLands*/ };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    })
)(IdentityCardComponent);