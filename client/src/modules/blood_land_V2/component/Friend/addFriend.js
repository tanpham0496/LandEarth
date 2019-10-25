import React, {Fragment, useState} from 'react'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch} from "react-redux";
import {loadingImage} from "../../../blood_land/components/general/System";


const AddFriendComponent = () => {
    const dispatch = useDispatch();
    const [resultStatus, setResultStatus] = useState();
    const searchFriend = () => {
        setResultStatus(Math.round(Math.random()))
    };
    return (
        <Fragment>
            <div className='addFriend-header'>
                <div className='title-header'>
                    맑은 고딕
                </div>
                <div className='button-header'
                     onClick={() => dispatch(screenActions.removePopup({names: ['addFriend']}))}>
                    <div className='button-return'>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='line-container'/>
            <div className='searchFriend-container'>
                <div className='searchField'>
                    <input/>
                    <div onClick={() => searchFriend()}>
                        <img alt={'search'} src={loadingImage("images/bloodlandNew/search-icon.png")}/>
                    </div>

                </div>
            </div>
            <div className='result-search'>
                {/*//success*/}
                {resultStatus === 1 && <Fragment>
                    <div className='friend-name'>
                        Friend
                    </div>
                    <div className='friend-button-container'>
                        <div className='friend-button'>
                            <div>+</div>
                        </div>
                    </div>
                </Fragment>}

                {/*//failed*/}
                {resultStatus === 0 && <Fragment>
                    <div className='error-icon'>
                        <img alt='error' src={loadingImage('/images/bloodLandNew/error-icon.png')}/>
                    </div>
                    <div className='error-mess'>
                        검색 된 아이다가 없습니다
                    </div>
                </Fragment>}


            </div>
        </Fragment>
    )
};
export default AddFriendComponent
