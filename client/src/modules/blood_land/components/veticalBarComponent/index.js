import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import connect from "react-redux/es/connect/connect";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import GameTabScreenValueGameUi from "./gameTabScreenValueGameUi";
import GameNavigation from "./GameNavigation"
import _ from 'lodash'
class DefaultScreenGameUi extends Component {

    tileRightMouseClick = () => {
        if(this.props.screens['ContextMenu']){
            setTimeout(() => {
                this.props.removePopup({name: "ContextMenu"});
            }, 0.0001);
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {gameMode, screens, removePopup} = this.props;
        // const getElementGameTab = document.getElementsByClassName("game-tab-content");
        // if(getElementGameTab && getElementGameTab[0]) getElementGameTab[0].style.width = "235px";
        if(!_.isEqual(gameMode , prevProps.gameMode)){
            const screenCheck = ['itemsInventory', 'characterInventory', 'giftInventory', 'landTrade' ];
            const checkScreen = (screen) => {
                return screens["open"] && screens["open"].screen !== screen;
            };
            if(!screenCheck.every(checkScreen)){
                removePopup({name: 'open'})
            }
        }
    }

    render() {
        const { screens } = this.props;
        // console.log('screens', screens["open"])

        const gameTabContentClass = classNames({ 'game-tab-content': Boolean(screens['open']) , 'game-tab-content--hidden': !Boolean(screens['open']) });
        return (
            <Fragment >
                <div className={`game-ui ${Boolean(screens['gameUIShow']) ? 'game-ui--show-content' : "" }`} onContextMenu={() => this.tileRightMouseClick()} onClick={() => this.tileRightMouseClick()} >
                    <div className={gameTabContentClass} id={gameTabContentClass}>
                        <GameTabScreenValueGameUi currentScreenValue ={screens["open"] ? screens["open"].screen : ''}/>
                    </div>
                    <GameNavigation/>
                </div>
            </Fragment>
        );
    }


}

function mapStateToProps(state) {
    const {
        screens
    } = state;
    return {
        screens
    };
}

const mapDispatchToProps = (dispatch) => ({
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

const connectedFunctionPage = connect(mapStateToProps, mapDispatchToProps)(DefaultScreenGameUi);
export default connectedFunctionPage;
