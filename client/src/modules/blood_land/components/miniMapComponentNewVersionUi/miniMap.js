
//MinhTan miniMap

import React, { useState} from "react";
import {connect} from "react-redux";
import MiniMapContainer from "./component/MiniMapContainer";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {loadingImage} from "../general/System";

function MiniMapNewVersion(props){
    const [toggleCountry, setToggleCountry] = useState(true);
    const [toggleCity, setToggleCity] = useState(true);
    const [toggleTown, setToggleTown] = useState(true);
    //
    // const ItemEarth = [
    //     {
    //         image: loadingImage('/images/game-ui/minimap-earth.svg'),
    //         type: 'toggle-btn-country'
    //     },
    //     {
    //         image: loadingImage('/images/game-ui/minimap-earth.svg'),
    //         type: 'toggle-btn-city'
    //     },
    //     {
    //         image: loadingImage('/images/game-ui/minimap-earth.svg'),
    //         type: 'toggle-btn-town'
    //     },
    //
    // ];

    const handleToggleOnClick = (type) => {
        switch (type) {
            case 'toggle-btn-country':
                setTimeout(()=> {
                    setToggleCountry(!toggleCountry);
                },0.01);
                break;
            case 'toggle-btn-city':
                setTimeout(()=> {
                    setToggleCity(!toggleCity);
                },0.01);
                break;
            case 'toggle-btn-town':
                setTimeout(()=> {
                    setToggleTown(!toggleTown);
                },0.01);
                break;
            default:
                break;
        }
    };

    const imageEarth =  loadingImage('/images/game-ui/minimap-earth.svg');
    const tileRightMouseClick = () => {
        props.removePopup({name : "ContextMenu"});
    };

    return(
        // onClick and rightClick miniMap hide popup rightClick
        <div className='miniMap-container' onClick={() => tileRightMouseClick()} onContextMenu={() => tileRightMouseClick()}>
            <div className={`toggle-btn-country ${toggleCountry && 'open'}`} onClick={() => handleToggleOnClick('toggle-btn-country') }>
                <img style={{width: '29px'}} alt='' src={imageEarth}/>
            </div>
            <div className={`toggle-btn-city ${toggleCity && 'open'}`} onClick={()  => handleToggleOnClick('toggle-btn-city') }>
                <img style={{width: '29px'}} alt='' src={imageEarth}/>
            </div>
            <div className={`toggle-btn-town ${toggleTown && 'open'}`} onClick={()  => handleToggleOnClick('toggle-btn-town') }>
                <img style={{width: '29px'}} alt='' src={imageEarth}/>
            </div>
            <MiniMapContainer toggleCountry={toggleCountry} toggleCity={toggleCity} toggleTown={toggleTown} />
        </div>
    )
    // }
}



const mapDispatchToProps = (dispatch) => ({
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(null,mapDispatchToProps)(MiniMapNewVersion)