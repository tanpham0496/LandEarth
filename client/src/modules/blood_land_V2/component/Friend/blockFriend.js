import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import _ from 'lodash';
import classNames from 'classnames';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import TranslateLanguage from "../../../blood_land/components/general/TranslateComponent";
import UnBlockFriendPopup from '../Popup/MessageBox/UnBlockFriend/UnBlockFriendPopup'
import UnBlockFriendSuccess from "../Popup/MessageBox/UnBlockFriend/UnBlockFriendSuccess";

const BlockFriendComponent = () => {
    const {screens, authentication : {user}, users : {blockFriendList}} = useSelector(state=> state);
    const dispatch = useDispatch();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [blockListState, setBlockListState] = useState();
    const [friendSelected , setFriendSelected] = useState([]);
    useEffect(()=> {
        dispatch(userActions.getFriendListBlockList({userId : user._id}))
    },[])
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setBlockListState(prevState => ([...prevState, ...blockFriendList.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "friend-list-container");
    useEffect(() => {
        if (blockFriendList) {
            setBlockListState(blockFriendList.slice(0, 30))
        }
    }, [blockFriendList]);

    const onFriendSelected = (userId) => {
        let blockFriendSelectNew = [...blockListState];
        blockFriendSelectNew.map(bl => {
            if(bl.friend.userId === userId) {
                bl.checked = !bl.checked;
            }
            return bl;
        });
        setBlockListState(blockFriendSelectNew);

    };
    const onCheckAll = () => {
        const onCheckAll =  [...blockListState].filter(fl => fl.checked === true).length  ===  [...blockListState].length;
        if(onCheckAll) {
            let  friendListCheckAll = [...blockListState].map(fl => fl.checked = false);
            setBlockListState([...blockListState],friendListCheckAll);
        }
        else{
            let  friendListCheckAll = [...blockListState].map(fl => fl.checked = true);
            setBlockListState([...blockListState],friendListCheckAll);
        }

    };

    const onHandleUnBlockFriend = _.debounce((e) => {
        const unblockFriends =  [...blockListState].filter(fl => fl.checked === true);
        unblockFriends.length !== 0 && dispatch(screenActions.addPopup({name: 'UnBlockFriendPopup',data : {userId : user._id , unblockFriends : unblockFriends} }));
    }, 200);
    return (
        <Fragment>
            <div className='friend-header'>
                <div className='icon-header'>
                    <img  alt='friendList' src={loadingImage('/images/bloodLandNew/friend/blockFriend.png')}/>
                </div>
                <div className='title-header'>
                    <TranslateLanguage direct={'MenuTabLeft.myAccount.BlockedFriend'}/>
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['blockFriend'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='friend-body'>
                {blockFriendList && blockFriendList.length === 0 ? <div className='friend-empty-container'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    <TranslateLanguage direct={'MenuTabLeft.myAccount.BlockedFriend.noFriendBlocked'}/>
                </div> : <Fragment>
                    <div className='unBlock-container' onClick={(e) => onHandleUnBlockFriend(e)}>
                        <div className='unBlock-button'>
                            <img alt={'unBlock'} src={loadingImage('images/bloodlandNew/friend/unBlock-icon.png')}/>
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'MenuTabLeft.myAccount.BlockedFriend.unBlockBtn'}/>
                        </div>
                    </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={onCheckAll}
                                             checked={blockListState && blockListState.filter(fl=> fl.checked === true).length === blockListState.length }
                            />
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'MenuTabLeft.myAccount.BlockedFriend.selected'}/>
                        </div>
                        <div className='friend-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {blockListState && blockListState.filter(fl=> fl.checked === true).length }
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container' />
                    <div className='friend-list-container expand' id='friend-list-container'>
                        {blockListState && blockListState.map(({checked,friend :  {name,userId }}, index) => {
                            const itemEffectClass = classNames({
                                active: checked
                            });
                            return (
                                <div className='friend-list-item' key={index}>
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={() => onFriendSelected(userId)} checked={checked}/>
                                    </div>
                                    <div className='item-name'>
                                        {name}
                                    </div>
                                    <div className='item-effect'>
                                        <div className={itemEffectClass}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Fragment>}

            </div>
            {screens['UnBlockFriendPopup'] && <UnBlockFriendPopup param={screens.UnBlockFriendPopup}/>}
            {screens['UnBlockFriendSuccess'] && <UnBlockFriendSuccess />}
        </Fragment>
    )
};
export default BlockFriendComponent
