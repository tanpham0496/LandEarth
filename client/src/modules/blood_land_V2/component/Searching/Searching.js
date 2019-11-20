import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";

import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";

const list = [];
for(let i = 0 ; i < 1000 ;i ++ )
{
    const tempt = {
        img : 'https://api.mapbox.com/styles/v1/mapbox/light-v9/static/-78.3238,38.5429,5.68,0,0/300x200?access_token=pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNrMWtldHl2ejBjczgzb25wNWlreDVkMjgifQ.7pdpqi8QyPySNEhFbcLzdA',
        quataky : '1231453645645645xxxx' + i,
        idUser: i ,
        dateSell : '26/10/2019',
        tab: i,
        priceLand : '60000 Blood'
    } ;
    list.push(tempt);
}
const SearchingComponent = () => {
    const dispatch = useDispatch();
    const [toggleBtn, setToggleBtn] = useState(1);
    const [ListState, setListState] = useState();

    const fetchMoreListItems = () => {
        setTimeout(() => {
            setListState(prevState => ([...prevState, ...list.slice(prevState.length, prevState.length + 60)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "body-search");

    useEffect(() => {
        if (list) {
            setListState(list.slice(0, 60))
        }
    }, [list]);

    const handleClickBtn = (i) => {
        setToggleBtn(i)
    }

    return (
        <Fragment>
            <div className={'container-search'}>
                <div className={'header-search'}>
                    <div className={'header-child-search'}>
                        <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/searching.png')}/>
                        <div>네비게이터</div>
                        <div className='button-header'
                             onClick={() => dispatch(screenActions.removePopup({names: ['searching']}))}>
                            <div className='button-return'>
                                <div className='icon-button'/>
                            </div>
                        </div>
                    </div>
                    <div className={'btn-action-header'}>
                        <button className={`${toggleBtn === 1 ? 'active btn-items' : 'btn-items'}`} onClick={()=>handleClickBtn(1)}>아이템</button>
                        <div className={'line-height'}/>
                        <button className={`${toggleBtn === 2 ? 'active btn-tickets' : 'btn-tickets'}`} onClick={()=>handleClickBtn(2)}>이용권</button>
                    </div>
                </div>
                <div className={'body-search'} id={'body-search'}>

                    <div className={'list-search'}>
                        {toggleBtn === 1 ?
                            //these item land sell
                            ListState && ListState.map((value,ind) => {
                                return(
                                    <div className={'item-search'}>
                                        <div className={'image-search'}>
                                            <img src={value.img} />
                                        </div>
                                        <div className={'content'}>
                                            <div className={'id-user'}> userID : {value.idUser }</div>
                                            {/*<div className={'quataky'}> quatakyLand : {value.quataky  } </div>*/}
                                            <div className={'priceLand'}> Price land : {value.priceLand  } </div>
                                            <div className={'date-sell'}> Date Sell : {value.dateSell  } </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            //these new item for advertisement
                            ListState && ListState.map((value,ind) => {
                                return(
                                    <div className={'item-search'}>
                                        <div className={'image-search'}>
                                            <img src={value.img} />
                                        </div>
                                        <div className={'content'}>
                                            <div className={'id-user'}> userID : {value.idUser }</div>
                                            {/*<div className={'quataky'}> quatakyLand : {value.quataky  } </div>*/}
                                            <div className={'priceLand'}> Price land : {value.priceLand  } </div>
                                            <div className={'date-sell'}> Date Sell : {value.dateSell  } </div>
                                        </div>
                                    </div>
                                )
                            })

                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
};
export default SearchingComponent
