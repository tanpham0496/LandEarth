import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';
import { newVersionUI } from '../../../../../helpers/config';
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";

class ClearSelection extends Component {
    funcCode = 4;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active:true
    }

    async componentWillReceiveProps(nextProps){
        this.setState({ img: nextProps.selected ? this.SELECTED_IMG : this.IMG });
        if(!newVersionUI) this.setState({ active: !nextProps.gameMode });
    }

    handleOnClickOption = () => {
        this.props.removePopup({name : "ContextMenu"});
        this.props.clearSelected();
        
    };

    render(){
        const {active} = this.state;
        const nameLang = 'horizontalBarComponent.ClearSelection'
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                                                onMouseEnter={() => active && this.setState({ img: this.SELECTED_IMG }) }
                                                onMouseOut  ={() => active && this.setState({ img: this.props.selected ? this.SELECTED_IMG : this.IMG }) }
                                                >
                <img src={this.state.img} alt='' />
                <Tooltip descLang={nameLang} />
            </button>
        );
    }
}


function mapStateToProps(state) {
    const { authentication: {user},map,settingReducer:{gameMode} } = state;
    return {
        user, gameMode, map
    };
}
const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    toggleGame: (toggle) => dispatch(settingActions.toggleGameMode(toggle)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ClearSelection)