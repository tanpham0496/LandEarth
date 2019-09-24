import React, {Fragment, memo, useState, useEffect} from 'react';
import { connect, useDispatch } from "react-redux";
import {landActions} from "../../../../../store/actions/landActions/landActions";
import LandPurchasePopup from "../../gameUIComponent/LandTrading/LandPurchasePopup"
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import SellLand from "../../common/Components/SellLand";
// import MoveLand from "../../commonComponent/MoveLand";
import {mapActions, MessageBox, socketActions, TranslateLanguage} from "../../../../../helpers/importModule";
import LandSale from "../../gameUIComponent/MyLand/LandForSellComponent";
//import MyLand from "../../gameUIComponent/MyLand";
import GameNavigation from "../../veticalBarComponent/GameNavigation";
import GameTabScreenValueGameUi from "../../veticalBarComponent/gameTabScreenValueGameUi";
import classNames from "classnames";
// import _ from 'lodash';

const LandMapRightClick = memo((props) => {
    const dispatch = useDispatch();
    const { /*lands,*/ screens } = props;
    useEffect(() => {
        if(props.user && props.user._id) props.getAllLandCategoryNew({userId: props.user._id});
    },[]);

    const handleHidePopup = () => {
        props.removePopup({name: "LandPurchasePopup"});
        setTimeout(()=> {
            //props.clearSelected()
        },300)
    };
    //const {selected} = props.map;
    //const currentCategoryId = selected  && selected.length !== 0 && lands.myLands && lands.myLands[0] && lands.myLands[0].categoryId ;
    //const { myLands } = lands;
    //const filterSellMyLands = selected && myLands && myLands.filter(land => selected.some(sl => sl.quadKey === land.quadKey && (land.forSaleStatus === false)  ) );
    //move land
    // const filterMoveMyLands = selected && selected.length !== 0 && myLands && myLands.filter(land => selected.some(sl => (sl.quadKey === land.quadKey) && (land.forSaleStatus ===false) ));
    //const filterCancelSellMyLands = selected && selected.length !== 0 && myLands && myLands.filter(land => selected.some(sl => (sl.quadKey === land.quadKey) && (land.forSaleStatus === true) ));
    //console.log('filterCancelSellMyLands', filterCancelSellMyLands);
    const cancelLandInfos = props.lands.cancelLandInfos || [];
    //console.log('cancelLandInfos', cancelLandInfos);
    
    const gotoSellLand = () => {
        props.getAllLandById(props.user._id);
        setTimeout(()=> {
            props.removePopup({names: ["sellLand", "showTotalBlood"]})
        },0.0001);

        setTimeout(() => props.addPopup({name : 'MyLand'}), 0.1)
        setTimeout(()=> props.clearSelected(),0.1)
    };

    const confirmRemoveLand = () => {
        const objUnsellLand = {
            userId: props.user._id,
            mode: 'remove_sell',
            quadKeys: cancelLandInfos.map(land => land.quadKey),
            zoom: props.map.zoom
        };

        props.sellLandSocket(objUnsellLand);
        setTimeout(()=> props.clearSelected(), 0.001)
        
        props.removePopup({names: ["MyLand", "removeSellLandButton"]});
        dispatch(landActions.getListForSaleLands({ wToken: props.user.wToken }));
    };

    const getCancelLandSaleAlertPopup = () => {
        //console.log('getCancelLandSaleAlertPopup');
        const mode = "question"; //question //info //customize
        const yesBtn = () => confirmRemoveLand();
        const noBtn = () => props.removePopup({name : "removeSellLandButton"});
        const header =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.header'}/>;
        const body =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.body'}/>;
        return <MessageBox mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    const handleChangeScreen = () => {
        setTimeout(()=> {
            props.removePopup({name : "MyLand"})
        },0.0001);
    };

    const gameTabContentClass = classNames({
        'game-ui': true,
        'game-ui--show-content': Boolean(screens["MyLand"])
    });

    //console.log('sellLand start');
    return (
        <Fragment>
            {screens["LandPurchasePopup"] && <LandPurchasePopup handleShowPopup={null} handleHidePopup={handleHidePopup} modalPopup={true} selectedTiles={props.map.selected} />}
            {screens["sellLand"] && <SellLand gotoSellLand={gotoSellLand} {...screens["sellLand"]} />}}

            {/*{screens["MoveLand"] && filterMoveMyLands[0].categoryId && <MoveLand selectedLands={filterMoveMyLands} modalPopup={true} handleHidePopup={() => props.removePopup({name : "MoveLand"})}/>}*/}
            {screens["removeSellLandButton"] && cancelLandInfos && cancelLandInfos.length > 0 && getCancelLandSaleAlertPopup()}
            {screens["MyLand"] &&
                <div className={gameTabContentClass} onContextMenu={() => props.removePopup({name : "ContextMenu"}) } onClick={()=> props.removePopup({name : "ContextMenu"})}>
                    <div className={`${screens['hideGameTabContent'] ? 'hide-game-tab-content' : 'game-tab-content'}  `} /*id={'game-tab-content'}*/>
                        <div className='hide-panel' onClick={() => props.removePopup({name : "MyLand"})}>
                            <div className='hide-icon'/>
                        </div>
                        {screens["LandSale"] && <LandSale handleChangeScreen={() => handleChangeScreen()} /> }
                        {screens["GameTabScreenValueGameUi"] && <GameTabScreenValueGameUi currentScreenValue ={screens["open"] ? screens["open"].screen : ''}/> }
                    </div>
                    <GameNavigation activeInRightClick={true} />
                </div>
            }
        </Fragment>
    )
});


const mapStateToProps = (state) => {
    const {map, lands,screens, authentication: {user},lands: {categoryList}} = state;
    return {
        map,
        lands,
        screens,
        user,
        categoryList
    };
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LandMapRightClick);