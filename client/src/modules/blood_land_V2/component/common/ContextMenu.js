
import React, { useState, useRef, useEffect,Fragment } from 'react'
import TranslateLanguage from "../../../blood_land/components/general/TranslateComponent";

import {loadingImage} from "../../../blood_land/components/general/System";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {connect, useSelector} from "react-redux";
import _ from 'lodash';
import { MAX_BLOOD, MAX_SELECTED_TILE } from '../../../../helpers/constants';
import classNames from 'classnames';

function ContextMenu(props) {
    // const { selected } = props.map;
    const {maps : {selected}} = useSelector(state => state);
    const { buyLandInfos=[], sellLandInfos=[], cancelLandInfos=[] } = props.lands;
    const root = useRef();
    const {param} = props;
    useEffect(() => {
        _handleContextMenu(param);
    }, [param]);
    useEffect(() => {
        if(!selected || selected.length === 0) {
            props.removePopup({name : "ContextMenu"});
        }
    }, [selected])
    const _handleContextMenu = (param) => {
        const clickX = param.clientX;
        const clickY = param.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = root.current.offsetWidth;
        const rootH = root.current.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        //set location show contentMenu when click
        if (right) {
            root.current.style.left = `${clickX + 5}px`;
        }

        if (left) {
            root.current.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            root.current.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            root.current.style.top = `${clickY - rootH - 5}px`;
        }
    };
    //hide gameUI before right click
    const handleHide = () => {
        setTimeout( () => {
            props.removePopup({ name: 'open' });
        }, 0.000001);

        setTimeout(() => {
            props.removePopup({ name: 'gameUIShow' });
        }, 100);
        //hide GameTabScreenValueGameUi when right click sellland
        setTimeout(()=> {
            props.removePopup({name : "MyLand"})
        },0.0001);
    };
    const onHandleRenderItemForTreeFunction = (type) => {
        setTimeout(()=> {
            props.removePopup({name : 'ContextMenu'})
        },0);
        switch (type) {
            case 'buyLand':
                !_.isEmpty(buyLandInfos) && props.addPopup({name: "LandPurchasePopup"})
                break;
            case 'sellLand':
                setTimeout(()=>handleHide(),0.00001);
                setTimeout(()=> {
                    !_.isEmpty(sellLandInfos) && props.addPopup({name: "sellLand"})
                },0.01);
                setTimeout(()=> {
                    !_.isEmpty(sellLandInfos) && props.addPopup({name: "LandSale"})
                },100);
                break;
            case 'cancelSellLand':
                !_.isEmpty(cancelLandInfos) && props.addPopup({name: "removeSellLandButton"})
                break;
            default:
                break;
        }

    };

    const totalBlood = buyLandInfos.reduce((total, sl) => total += sl.sellPrice, 0);
    const ItemList = [
        {
            name:  <TranslateLanguage direct={'menuTab.transaction.buyLand'}/>,
            image: loadingImage('/images/game-ui/sm-icon/sm-medic.png'),
            disable: _.isEmpty(buyLandInfos) || totalBlood > MAX_BLOOD || buyLandInfos.length > MAX_SELECTED_TILE,
            type: 'buyLand'
        },{
            name: <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand'}/>,
            image: loadingImage('/images/game-ui/sm-sell-land.svg'),
            disable: _.isEmpty(sellLandInfos) || sellLandInfos.length > MAX_SELECTED_TILE,
            type: 'sellLand'
        },{
            name: <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.removeSellLandButton'}/>,
            image: loadingImage('../../../../../images/game-ui/sm-remove-land.svg'),
            disable: _.isEmpty(cancelLandInfos) || cancelLandInfos.length > MAX_SELECTED_TILE,
            type: 'cancelSellLand'
        }
    ];

    return (
        <Fragment>
            <div ref={root} className="contextMenu">
                <div className={"contextMenu--op-default"}/>
                <div className="contextMenu--separator-default"/>
                {ItemList.map((item, key) =>
                    <div  key={key} className={ item.disable ? 'contextMenu--option__disabled' : '' }>
                        <div className={"contextMenu--op"} onClick={() => onHandleRenderItemForTreeFunction(item.type)}>
                            <div className="contextMenu--option" >
                                {item.name}
                            </div>
                        </div>
                        <div className="contextMenu--separator"/>
                    </div>
                )}
            </div>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    const { map, lands} = state;
    return {
        map,
        lands
    };
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(mapStateToProps, mapDispatchToProps) (ContextMenu);
