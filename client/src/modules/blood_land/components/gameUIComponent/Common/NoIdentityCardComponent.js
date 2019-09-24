import React, { Fragment } from 'react'
import {connect} from 'react-redux';
import {
    landActions, screenActions,
    loadingImage
} from "../../../../../helpers/importModule";
import _ from 'lodash';

const socialLogo = {
    'facebook': loadingImage(`/images/game-ui/blood-email/facebook.svg`),
    'google': loadingImage(`/images/game-ui/blood-email/gmail.svg`),
    'kakao': loadingImage(`/images/game-ui/blood-email/kakao.svg`),
    'naver': loadingImage(`/images/game-ui/blood-email/naver.svg`),
    'twitter': loadingImage(`/images/game-ui/blood-email/twitter.svg`)
};

function NoIdentityCardComponent(props){
    const { user, lands: { myLandAmount } } = props;

    const snsList = user.wSns && user.wSns;
    const getSocialLogo = (social) => {
        return typeof socialLogo[social] !== 'undefined' ? socialLogo[social] : null;
    };

    return (
        <Fragment>
            {user.email && _.isNumber(myLandAmount) ?
                <li className='no-bg-hover' onClick={() => props.addPopup({ name: 'IdentityCardComponent', close: "NoIdentityCardComponent" })} style={{height: '62px'}}>
                    <div className='avatar-icon-container'>
                        <img src={loadingImage('/images/game-ui/blood-email.svg')} alt=''  /*onLoad={()=>this.handleImageLoaded()} onError={()=>this.handleImageErrored()}*//>
                        <div className="social-icon">
                            {snsList && snsList.map((item, key) => {
                                return (
                                    <img key={key} src={getSocialLogo(item)} alt=''/>
                                )
                            })}
                        </div>
                    </div>
                    <div>{user.email}</div>
                </li>
                : //null
                <li className='no-bg-hover' onClick={() => props.addPopup({ name: 'IdentityCardComponent', close: "NoIdentityCardComponent" })} style={{height: '62px'}}>
                    <div className='avatar-icon-container'>
                        <img src={loadingImage('/images/game-ui/blood-email.svg')} alt=''/>
                        <div className="social-icon">
                            {snsList && snsList.map((item, key) => {
                                return (
                                    <img key={key} src={getSocialLogo(item)} alt=''/>
                                )
                            })}

                        </div>
                    </div>
                    <div>{user.userName}@gmail.com</div>
                </li>
            }
        </Fragment>
    )
};

export default connect(
    state => {
        const { authentication: { user }, screens, lands } = state;
        return { user, screens, lands };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    })
)(NoIdentityCardComponent);
