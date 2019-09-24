import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';
import {newVersionUI} from '../../../../../helpers/config';

class MultiSelect extends Component {
    funcCode = 3;
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
    };

    async componentWillReceiveProps(nextProps) {
        this.setImg(nextProps.selected ? this.SELECTED_IMG : this.IMG);
        //console.log('nextProps.gameMode', nextProps.gameMode)
        // if(!newVersionUI)
        this.setState({active: !nextProps.gameMode});
    }

    handleOnClickOption = () => {
        const {lands} = this.props;
        if (lands && !lands.landLoading ) {
            //this.props.toggleGame(false); //don't change to land Map
            this.props.selectMode('multi');

            this.props.handleFuncSelect(this.funcCode);
        }
    };

    render() {
        const {active} = this.state;
        const nameLang = 'horizontalBarComponent.MultiSelect'
        // const descLang = 'horizontalBarComponent.MultiSelect.desc';
        return (
            <button className={`game-func-btn  ${!active ? 'deactive' : 'none'}`}
                    onClick={() => active && this.handleOnClickOption()}
                    onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                    onMouseOut={() => active && this.setImg(this.props.selected ? this.SELECTED_IMG : this.IMG)}>
                <img src={this.state.img} alt=''/>
                <Tooltip descLang={nameLang}/>
            </button>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, map, settings: {gameMode}, lands} = state;
    return {
        user, gameMode, map, lands
    };
}

const mapDispatchToProps = (dispatch) => ({
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    toggleGame: (toggle) => dispatch(settingActions.toggleGameMode(toggle)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelect)
