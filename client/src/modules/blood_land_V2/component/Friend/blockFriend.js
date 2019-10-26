import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import _ from 'lodash';
import classNames from 'classnames';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../../../store/actions/commonActions/userActions";

// getFriendListBlockList: (userId) => dispatch(userActions.getFriendListBlockList({userId: userId})),
let list = [];
for (let i = 0; i < 1000; i++) {
    let temp = {"type": i, "name": "Hell"}
    list.push(temp)
}

const BlockFriendComponent = () => {
    const dispatch = useDispatch();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [friendListState, setFriendListState] = useState();
    const [friendSelected , setFriendSelected] = useState([]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setFriendListState(prevState => ([...prevState, ...list.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "friend-list-container");

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (list) {
            setFriendListState(list.slice(0, 30))
        }
    }, [list]);

    const onFriendSelected = (e, item) => {
        let friendSelectedNew = [...friendSelected];
        const checkSelected = friendSelectedNew.some(i =>  i === item.type);
        checkSelected ? _.remove(friendSelectedNew , (n) => n === item.type) :  friendSelectedNew.push(item.type)
        setIsCheckAll(friendSelectedNew.length === list.length)
        setFriendSelected(friendSelectedNew)
    };
    const onCheckAll = (e) => {
        setIsCheckAll(e.checked)
        let friendSelectedNew = [];
        list.map(i =>  friendSelectedNew.push(i.type))
        setFriendSelected(e.checked ? friendSelectedNew : [])
    };

    const onHandleUnBlockFriend = _.debounce((e) => {
        // console.log('friendSelected', friendSelected)
        if(friendListState.length > 0){
            dispatch(screenActions.addPopup({name: 'ConfirmUnBlockScreen'}))
        }
    }, 200);
    return (
        <Fragment>
            <div className='friend-header'>
                <div className='icon-header'>
                    <img  alt='friendList' src={loadingImage('/images/bloodLandNew/friend/blockFriend.png')}/>
                </div>
                <div className='title-header'>
                    차단된 친구
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['blockFriend'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='friend-body'>
                {list.length === 0 ? <div className='friend-empty-container'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    차단된 친구 없음
                </div> : <Fragment>
                    <div className='unBlock-container' onClick={(e) => onHandleUnBlockFriend(e)}>
                        <div className='unBlock-button'>
                            <img alt={'unBlock'} src={loadingImage('images/bloodlandNew/friend/unBlock-icon.png')}/>
                        </div>
                        <div className='checkAll-title'>
                            차단 해제
                        </div>
                    </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={(e) => onCheckAll(e)} checked={isCheckAll}/>
                        </div>
                        <div className='checkAll-title'>
                            전체 선택
                        </div>
                        <div className='friend-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {friendSelected.length}
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container' />
                    <div className='friend-list-container expand' id='friend-list-container'>
                        {friendListState && friendListState.map((item, index) => {
                            const itemEffectClass = classNames({
                                active: friendSelected.some(i => i === item.type)
                            });
                            return (
                                <div className='friend-list-item' key={index}>
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={(e) => onFriendSelected(e , item)} checked={friendSelected.some(i => i === item.type)}/>
                                    </div>
                                    <div className='item-name'>
                                        abc
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
        </Fragment>
    )
};
export default BlockFriendComponent
