import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import _ from 'lodash';
import classNames from 'classnames';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";


let list = [];
for (let i = 0; i < 10000; i++) {
    let temp = {"type": i, "name": "Hell"}
    list.push(temp)
}

const SearchingComponent = () => {
    const dispatch = useDispatch();
    // const [isCheckAll, setIsCheckAll] = useState(false);
    // const [friendListState, setFriendListState] = useState();
    // const [friendSelected , setFriendSelected] = useState([]);
    // const fetchMoreListItems = () => {
    //     setTimeout(() => {
    //         setFriendListState(prevState => ([...prevState, ...list.slice(prevState.length, prevState.length + 30)]));
    //         setIsFetching(false);
    //     }, 500);
    // };
    // const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "friend-list-container");
    //
    // useEffect(() => {
    //     if (list) {
    //         setFriendListState(list.slice(0, 30))
    //     }
    // }, [list]);
    //



    return (
        <Fragment>
            <div className={'container-searching'}>
                <div className={'header-searching'}>
                    <div className={'title'}>  부동산 </div>
                    <div className='button-header'
                         onClick={() => dispatch(screenActions.removePopup({names: ['searching']}))}>
                        <div className='button-return'>
                            <div className='icon-button'/>
                        </div>
                    </div>
                </div>
                <div className={'body-searching'}>
                     <div className={'title-body'}> 광고 </div>
                </div>
            </div>

        </Fragment>
    )
};
export default SearchingComponent
