import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {translate} from "react-i18next";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";

let listFriend = [];
for (let i=0; i <= 10000; i++) {
    let tmp = {'name' : 'Chị Loan', 'activity' : i%5===0 ? 'online' : 'offline' };
    listFriend.push(tmp);
}

const ListFriendActivity = (props) => {
    const [friendList, setFriendList] = useState();
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setFriendList(prevState => ([...prevState, ...listFriend.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "list-contact-friend");

    useEffect(() => {
        if (listFriend) {
            setFriendList(listFriend.slice(0, 30))
        }
    }, [listFriend]);

    return (
        <Fragment>
            <div className={'list-contact-friend'} id={'list-contact-friend'}>
                {friendList && friendList.map((value,ind)=> {
                    return(
                        <div key={ind} className={'row-list-friend'}>
                            <div className={'name'}>
                                {value.name}
                            </div>
                            <div className={`${value.activity}`}>
                                {value.activity}
                            </div>
                        </div>
                    )
                })}

            </div>
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    const { authentication: {user} , screens ,  settingReducer:{language}} = state;
    return {
        user,
        screens,
        language
    };
};
const mapDispatchToProps = (dispatch) => ({
    onSendMessage : (data) => dispatch(socketActions.userSendMessage(data)),
    addPopup : (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup : (screen) => dispatch(screenActions.removePopup(screen))
})
export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(ListFriendActivity))
