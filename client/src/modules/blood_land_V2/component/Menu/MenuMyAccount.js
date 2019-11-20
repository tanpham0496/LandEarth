import React, {useState,Fragment} from 'react'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch ,useSelector} from "react-redux";
import {IconTabListMyAccount} from "./data" ;
import InformationPopup from '../Popup/componentPopupMenu/informationPopup'


//Directory
    // index => MenuIconTabList => MenuMyAccountComponent


const MenuMyAccountComponent = () => {
    const [imageIconTabActive, setImageIconTabActive] = useState();
    const [tabSelected, setTabSelected] = useState();
    const [tabChildrenSelected , setTabChildrenSelected] = useState();
    const dispatch = useDispatch();
    const {screens} = useSelector(state=> state);

    const onHandleIconTabClick = (e, item) => {
        e.persist();
        if(item.tabIndex === 1) {
            dispatch(screenActions.addPopup({name : 'information'}))
        }
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
        IconTabListMyAccount.map((item, index) => {
            return (
                <Fragment>
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
                    {screens['information'] && <InformationPopup/>}
                </Fragment>

            )
        })
    )
};
export default MenuMyAccountComponent
