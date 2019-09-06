import React, { useState, useRef, useEffect,Fragment } from 'react'
import TranslateLanguage from "../../general/TranslateComponent";

import {loadingImage} from "../../general/System";
import LandPurchasePopup from "../../gameUIComponent/LandTrading/LandPurchasePopup";
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import connect from "react-redux/es/connect/connect";
import Tooltip from "../../general/Tooltip";

const ItemList = [
    {
        name:  <TranslateLanguage direct={'menuTab.transaction.buyLand'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-medic.png'),
        type: 'buyLand'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.move'}/>,
        image: loadingImage('/images/game-ui/sm-move.svg'),
        type: 'move'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand'}/>,
        image: loadingImage('/images/game-ui/sm-sell-land.svg'),
        type: 'sellLand'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.tree'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-tree.png'),
        type: 'cultivation'
    },
];


function ContextMenuGame(props) {

    const [visible,setVisible] = useState(false);
    const root = useRef();

    useEffect(() => {
        window.addEventListener('contextmenu', _handleContextMenu);
        // window.addEventListener('click', _handleClick);
        // window.addEventListener('scroll', _handleScroll);
        // returned function will be called on componentunmount
        return () => {
            window.removeEventListener('contextmenu',  _handleContextMenu);
            // window.removeEventListener('click', _handleClick);
            // window.removeEventListener('scroll', _handleScroll);
        };
    }, []);


    const _handleContextMenu = (event) => {
        event.preventDefault();

        setVisible(true);

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = root.current.offsetWidth;
        const rootH = root.current.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

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
    const onHandleRenderItemForTreeFunction = (type) => {
        setTimeout(()=> {
            setVisible(false);
        },0.00001);
        switch (type) {
            case 'buyLand':
                setTimeout(()=> {
                    props.addPopup({name: "LandPurchasePopup"})
                },100);
                break;
            case 'sellLand':
                setTimeout(()=> {
                    props.addPopup({name: "SellLand"})
                },100);
                break;
            case 'move':
                break;
            default:
                break;
        }

    };

    return (
        <Fragment>
            {(visible || null) && <div ref={root} className="contextMenu">
                <div className={"contextMenu--op-default"}/>
                <div className="contextMenu--separator-default"/>
                {ItemList.map((value, index) => {
                    const { name, type } = value;
                    return (
                        <div className={"contextMenu--op"} key={index} onClick={() => onHandleRenderItemForTreeFunction(type)}>
                            <div className="contextMenu--option" >
                                <div>
                                    {name}
                                </div>
                            </div>
                            <div className="contextMenu--separator"/>
                        </div>
                    )
                })}
            </div>}
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    const { map} = state;
    return {
        map
    };
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});
export default connect(mapStateToProps, mapDispatchToProps) (ContextMenuGame);


