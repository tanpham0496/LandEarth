import React, {Component} from 'react'
import TranslateLanguage from "../../general/TranslateComponent";
import connect from "react-redux/es/connect/connect";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";

class ContextMenuGame extends Component {
    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
        document.removeEventListener('click', this._handleClick);
        document.removeEventListener('scroll', this._handleScroll);
    }

    _handleContextMenu = (event) => {
        event.preventDefault();

        this.props.addPopup({ name: "ContextMenuGame" });

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }

        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick = (event) => {
        const wasOutside = !(event.target.contains === this.root);

        if (wasOutside ) this.props.removePopup({ name: "ContextMenuGame" });
    };

    _handleScroll = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false, });
    };


    render() {
        return(
            <div ref={ref => {this.root = ref}} className="contextMenu">
                <div className={"contextMenu--op-default"}>

                </div>
                <div className="contextMenu--separator-default" />
                <div className={"contextMenu--op"}>
                    <div className="contextMenu--option" onClick={() => alert('Btamin shovel')}>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient'}/>
                        </div>
                    </div>
                    <div className="contextMenu--separator" />
                </div>
                <div className={"contextMenu--op"}>
                    <div className="contextMenu--option" onClick={() => alert('droplet')}>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel'}/>
                        </div>
                    </div>
                    <div className="contextMenu--separator" />
                </div>
                <div className={"contextMenu--op"}>
                    <div className="contextMenu--option" onClick={() => alert('Setting')}>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.water'}/>
                        </div>
                    </div>
                    <div className="contextMenu--separator" />
                </div>
                <div className={"contextMenu--op"}>
                    <div className="contextMenu--option">
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree'}/>
                        </div>
                    </div>
                    <div className="contextMenu--separator" />
                </div>
            </div>
        )
    };
}
export default connect(
    state => {
        const { screens } = state;
        return  screens;
    }, dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(ContextMenuGame)