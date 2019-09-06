import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';
import { newVersionUI } from '../../../../../helpers/config';

class SingleSelect extends Component {
    funcCode = 2;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active: true
    }
    setImg = (img) => {
        this.setState({
            img: img
        })
    }

    componentWillReceiveProps(nextProps) {
        // /console.log('this.props', nextProps);
        this.setState({
            img: nextProps.selected ? this.SELECTED_IMG : this.IMG
        });
        if(!newVersionUI) this.setState({ active: !nextProps.gameMode });
    }

    handleOnClickOption = () => {
        this.props.selectMode('single');
        this.props.handleFuncSelect(this.funcCode);
        //this.props.toggleGame(false); //don't change to land Map
    };

    render() {
        const {active} = this.state;
        const nameLang = 'horizontalBarComponent.SingleSelect'
        // const descLang = 'horizontalBarComponent.SingleSelect.desc';
        return (
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`}
                    onClick={() => active && this.handleOnClickOption()}
                    onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                    onMouseOut={() => active && this.setImg(this.props.selected ? this.SELECTED_IMG : this.IMG)}>
                <img src={this.state.img} alt=''/>
                <Tooltip descLang={nameLang} />
            </button>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, map, settingReducer: {gameMode}} = state;
    return {
        user, gameMode, map
    };
}

const mapDispatchToProps = (dispatch) => ({
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    toggleGame: (mode) => dispatch(settingActions.toggleGameMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSelect)