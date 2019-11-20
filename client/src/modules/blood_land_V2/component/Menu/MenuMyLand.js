import React, {useState,Fragment} from 'react'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch ,useSelector} from "react-redux";
import {IconTabListMyLand} from "./data" ;



const MenuMyLand = () => {
    const [imageIconTabActive, setImageIconTabActive] = useState();
    const [tabChildrenSelected , setTabChildrenSelected] = useState();
    const dispatch = useDispatch();

    const onHandleIconChildrenClick = (e, item) => {
        e.persist();
        dispatch(screenActions.addPopup({name: item.name , close: tabChildrenSelected}))
        setTabChildrenSelected(item.name);
    };
    const iconRender = (nameClass, item ) => {
        return (
            <div className={nameClass} style={{display: 'flex'}}
                 onMouseEnter={() => setImageIconTabActive(item.name)}
                 onMouseLeave={() => setImageIconTabActive()}
                 onClick={(e) =>  onHandleIconChildrenClick(e, item)}>
                <img alt={item.name}
                     src={imageIconTabActive === item.name ? item.imageUrlActive : item.imageUrl}/>
            </div>
        )
    };
    return(
        IconTabListMyLand.map((item, index) => {
            return (                                                            
                <Fragment key={index}>
                    <div className='icon-tab-container'>
                        {iconRender('icon-tab' , item)}
                    </div>
                </Fragment>

            )
        })
    )
};
export default MenuMyLand
