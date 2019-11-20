import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";

import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";

const list = [];
for(let i = 0 ; i< 1000 ;i ++ )
{
   const tempt = {class : 'item-voted', content : '50%', id: i} ;
   list.push(tempt);
}
const WareHouse = () => {
    const dispatch = useDispatch();
    const [toggleBtn, setToggleBtn] = useState(1);
    const [ListState, setListState] = useState();

    const fetchMoreListItems = () => {
        setTimeout(() => {
            setListState(prevState => ([...prevState, ...list.slice(prevState.length, prevState.length + 60)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "body-wareHouse");

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
             <div className={'container-wareHouse'}>
                <div className={'header-wareHouse'}>
                     <div className={'header-child-wareHose'}>
                         <img alt={'image ware house'} src={loadingImage('/images/bloodLandNew/wareHouse-hover.png')}/>
                         <div>인벤토리</div>
                         <div className='button-header'
                              onClick={() => dispatch(screenActions.removePopup({names: ['wareHouse']}))}>
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
                 <div className={'body-wareHouse'} id={'body-wareHouse'}>
                     {toggleBtn === 1 ?
                         //these item ads used
                         ListState && ListState.map((value,ind) => {
                             return(
                                 <div className={value.class} key={ind} onClick={()=> console.log('value.id',value.id)}>
                                     <div className={'percent-use-ads'}> {value.content} </div>
                                     <img alt={value.class} src={loadingImage('/images/bloodLandNew/icon-unused-ads.png')}/>
                                 </div>
                             )
                         })
                         :
                         //these new item purchage for advertisement
                         ListState && ListState.map((value,ind) => {
                             return(
                                 <div className={value.class} key={ind} onClick={()=> console.log('value.id',value.id)}>
                                     <div className={'percent-use-ads'}> {value.content} </div>
                                     <img alt={value.class} src={loadingImage('/images/bloodLandNew/icon-using-ads.png')}/>
                                 </div>
                             )
                         })

                     }
                 </div>
             </div>
        </Fragment>
    )
};
export default WareHouse
