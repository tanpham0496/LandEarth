import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { userActions } from "../store/actions/commonActions/userActions";
import React from 'react';
import isEmpty from 'lodash.isempty';
import { bloodAppId } from "../../src/helpers/config";
import WrappedComponent from '../modules/blood_land_V2';

class WithAuthorization extends React.Component {

    checkCase({ user }){
        if(isEmpty(user)){
            if(localStorage && localStorage.token) return "refresh";
            else  return "logout";
        } else {
            return "login";
        }
    }

    componentDidMount(){
        const { user, userToken, getByToken } = this.props;
        const action = this.checkCase({ user });
        const token = userToken.token || localStorage.token;
        if(token && action === "refresh") getByToken({ token });
    }

    render() {

        const { user } = this.props;
        const action = this.checkCase({ user });
        if(process.env.NODE_ENV === "development"){
            if(action === 'login'){
                return (typeof user !== 'undefined' && typeof user.role !== 'undefined' && !isEmpty(user.token))?
                    <WrappedComponent {...this.props} />: <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />;
            } else if(action === 'logout'){
                return <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />;
            } else if(action === 'refresh'){

                return <div className={`load`} style={{zIndex: 1}}>
                    <div className='load__icon-wrap'>
                        <div className="lds-facebook">
                                <div/><div/><div/><div/><div/><div/><div/><div/>
                        </div>
                    </div>
                </div>;
            }

        } else {
            if(action === 'login'){
                return (typeof user !== 'undefined' && typeof user.role !== 'undefined' && !isEmpty(user.token))?
                    <WrappedComponent {...this.props} />:<Route component={() => { window.location.replace('https://wallet.blood.land/sns/logout/ext?appId='+bloodAppId); return null;} }/>;
            } else if(action === 'logout'){
                return <Route component={() => { window.location.replace('https://wallet.blood.land/sns/logout/ext?appId='+bloodAppId); return null;} }/>
            } else if(action === 'refresh'){
                return <div className={`load`}>
                    <div className='load__icon-wrap'>
                        <div className="lds-facebook">
                                <div/><div/><div/><div/><div/><div/><div/><div/>
                        </div>
                    </div>
                </div>;
            }
        }
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getByToken: (token) => {
            return dispatch(userActions.getByToken(token))
        }
    }
};

const mapStateToProps = (state) => {
    const { authentication: {loggingIn, user}, userToken   } = state;
    return { userToken, loggingIn, user  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthorization);

// loadingLandAction ? <div className='load' style={{zIndex: 1}}>
//     <div className='load__icon-wrap'>
//         <div className="lds-facebook">
//             <div></div>
//             <div></div>
//             <div></div>
//         </div>
//     </div>
// </div>
