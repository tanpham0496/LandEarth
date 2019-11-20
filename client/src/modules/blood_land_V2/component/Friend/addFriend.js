import React, {Fragment, useState, useEffect} from 'react'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import {loadingImage} from "../../../blood_land/components/general/System";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import TranslateLanguage from "../../../blood_land/components/general/TranslateComponent";


const AddFriendComponent = () => {
    const dispatch = useDispatch();
    const {users, users: { addFriendList,foundFriends,status }, authentication: {user}} = useSelector(state => state);
    const [foundPeople, setFoundPeople ] = useState();

    const [textSearch, setTextSearch] = useState('');
    const [checkFriendAlert, setCheckFriendAlert] = useState(false);

    const [checkAddSuccess, setCheckAddSuccess] = useState(false);

    const onHandleCheckFriend = () => {
        setCheckFriendAlert(true);
        setCheckAddSuccess(false);
        dispatch(userActions.findFriend({userName: textSearch, currentUserId: user._id}));
    };
   
    useEffect( () => {
        foundFriends &&  setFoundPeople(foundFriends);
    },[foundFriends]);

    const onHandleKeyPress = (e) => {
        if(e.keyCode === 13){
            onHandleCheckFriend();
        }
    };
    const _onHandleAddFriend = () => {
        dispatch(userActions.sendAddFriend({mySelf: {_id : user._id, name : user.userName}, friendAdd : [{'userId': foundPeople.foundUser[0].id, 'name': foundPeople.foundUser[0].userName}]}));
        setCheckFriendAlert(false);
        setTextSearch('');
        setCheckAddSuccess(true);
    };

    return (
        <Fragment>
            <div className='addFriend-header'>
                <div className='title-header'>
                    <TranslateLanguage direct={'MenuTabLeft.myAccount.addFriend'}/>
                </div>
                <div className='button-header'
                     onClick={() => {dispatch(screenActions.removePopup({names: ['addFriend']}));  setCheckAddSuccess(false)  }}>
                    <div className='button-return'>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='line-container'/>
            <div className='searchFriend-container'>
                <div className='searchField'>
                    <input value={textSearch} onChange={(e)=> setTextSearch(e.target.value)} onKeyDown={onHandleKeyPress} />
                    <div onClick={onHandleCheckFriend} style={{cursor : 'pointer'}}>
                        <img alt={'search'} src={loadingImage("images/bloodlandNew/search-icon.png")}/>
                    </div>

                </div>
            </div>
            <div className='result-search'>
                { checkFriendAlert && foundPeople && (foundPeople.status === 'empty' || foundPeople.status === 'self') &&
                    <Fragment>
                        <div className='error-icon'>
                            <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                        </div>
                        <div className='error-mess'>
                            <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.notFound'}/>
                        </div>
                    </Fragment>
                }
                { checkFriendAlert && foundPeople && foundPeople.status === 'block' &&
                    //!this.props.resetChat &&
                    <Fragment>
                        <div className='error-icon'>
                            <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                        </div>
                        <div className='error-mess'>
                            <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.blocked'}/>
                        </div>
                    </Fragment>
                }
                { checkFriendAlert && foundPeople && foundPeople.status === 'friend' &&
                    <Fragment>
                        <div className='error-icon'>
                            <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                        </div>
                        <div className='error-mess'>
                            <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.foundFriends'}/>
                        </div>
                    </Fragment>
                }
                { checkFriendAlert && foundPeople && foundPeople.status === 'waiting' &&
                <Fragment>
                    <div className='error-icon'>
                        <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                    </div>
                    <div className='error-mess'>
                        <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.waiting'}/>
                    </div>
                </Fragment>
                }
                { checkFriendAlert && foundPeople && foundPeople.status === 'received' &&
                <Fragment>
                    <div className='error-icon'>
                        <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                    </div>
                    <div className='error-mess'>
                        <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.received'}/>
                    </div>
                </Fragment>
                }

                {checkFriendAlert && foundPeople && foundPeople.status === 'normal' && foundPeople.foundUser[0].userName && <Fragment>
                    <div className='friend-name'>
                        {foundPeople.foundUser[0].userName}
                    </div>
                    <div className='friend-button-container'>
                        <div className='friend-button' onClick={_onHandleAddFriend}>
                            <div>+</div>
                        </div>
                    </div>
                </Fragment> }
                
                {checkAddSuccess && !checkFriendAlert && status === true && <Fragment>
                    <div className='success-icon'>
                        <img alt='error' src={loadingImage('/images/bloodLandNew/success-icon.png')}/>
                    </div>
                    <div className='success-mess'>
                        <TranslateLanguage direct={'menuTab.user.friend.friendSearch.getDefaultScreen.success'}/>
                    </div>
                </Fragment>}
                

            </div>
        </Fragment>
    )
};
export default AddFriendComponent
