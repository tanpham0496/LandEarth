import React, {useState} from 'react'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch} from "react-redux";
import {IconTabList} from "./data"


//Directory
    // index => MenuIconTabList => MenuMyAccountComponent


const MenuMyAccountComponent = () => {
    const [imageIconTabActive, setImageIconTabActive] = useState();
    const [tabSelected, setTabSelected] = useState();
    const [tabChildrenSelected , setTabChildrenSelected] = useState();
    const dispatch = useDispatch();

    const onHandleIconTabClick = (e, item) => {
        e.persist();
        if (tabSelected === item.tabIndex) {
            setTabSelected();
        } else if (item.childrenTab) {
            setTabSelected(item.tabIndex)
        }
    };
    const onHandleIconChildrenClick = (e, item) => {
        e.persist();
        dispatch(screenActions.addPopup({name: item.name , close: tabChildrenSelected}))
        setTabChildrenSelected(item.name);
    };
    const iconRender = (nameClass, item) => {
        const checkNameClass = nameClass === 'icon-tab-children';
        const checkDisplay = !checkNameClass ? 'flex' : tabSelected === item.tabParent ? 'flex' : 'none';
        return (
            <div className={nameClass} style={{display: checkDisplay}}
                 onMouseEnter={() => setImageIconTabActive(item.name)}
                 onMouseLeave={() => setImageIconTabActive()}
                 onClick={(e) => !checkNameClass ? onHandleIconTabClick(e, item) : onHandleIconChildrenClick(e, item)}>
                <img alt={item.name}
                     src={imageIconTabActive === item.name ? item.imageUrlActive : item.imageUrl}/>
            </div>
        )
    };
    return(
        IconTabList.map((item, index) => {
                return (
                    <div className='icon-tab-container' key={index}>
                        {iconRender('icon-tab' , item )}
                        {item.childrenTab && item.childrenTab.map((itemChild, indexChild) => {
                            return(
                                <div key={indexChild}>
                                    {iconRender('icon-tab-children' , itemChild)}
                                </div>
                            )
                        })}
                    </div>
                )
            })
    )
};
export default MenuMyAccountComponent
