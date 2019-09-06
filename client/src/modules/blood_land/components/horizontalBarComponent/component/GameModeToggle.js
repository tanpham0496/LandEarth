import React, {Component} from 'react'
import {connect} from "react-redux";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';
import { landActions ,screenActions} from "../../../../../helpers/importModule"

class GameModeToggle extends Component {
    funcCode = 11;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        selected:false,
        active:true
    }
    setImg = (img) =>{
        this.setState({
            img: img
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gameMode === false){
            this.setState({
                selected: false,
                img: this.IMG
            });
        }
        if(nextProps.gameMode === true){
            this.setState({
                selected: true,
                img: this.SELECTED_IMG
            });
        }
    }

    checkSelected = (selected) =>{
        if(selected)
            this.setImg(this.SELECTED_IMG);
        else{
            this.setImg(this.IMG);
        }
    }

    handleOnClickOption = () => {
        setTimeout(() => {
            this.props.removePopup({name : "ContextMenu"});
            this.props.removePopup({name : "MyLand"});
        }, 0.001)

        this.setState({
            selected: !this.state.selected
        });
        setTimeout(() => {
            this.props.toggleGame(this.state.selected);
        }, 100);
        //getLandByQuadKeys -> fix totalBlood = 0 when change modeGame
        const {selected} = this.props.map;
        if(selected && selected.length > 0) {
            this.props.getLandByQuadKeys({ userId: this.props.user._id, quadKeys: selected.map(tile => tile.quadKey) });
        }
    };

    render(){
        const {active,selected} = this.state;
        const nameLang = selected ? 'horizontalBarComponent.GameModeToggle.Game' : 'horizontalBarComponent.GameModeToggle.RealEstate'
        // const descLang = 'horizontalBarComponent.GameModeToggle.desc';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption() }
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(this.state.selected)} >
                <img src={this.state.img} alt='' />
                <Tooltip descLang={nameLang} />
            </button>
        );
    }
}

function mapStateToProps(state) {
    const { authentication: {user},settingReducer:{gameMode}, map  } = state;
    return {
        user,gameMode, map
    };
}

const mapDispatchToProps = (dispatch) => ({
    toggleGame: (toggle) => dispatch(settingActions.toggleGameMode(toggle)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    getLandByQuadKeys: (param) => dispatch(landActions.getLandByQuadKeys(param)),
});

export default connect(mapStateToProps,mapDispatchToProps)(GameModeToggle)