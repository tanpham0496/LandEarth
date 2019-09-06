import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';

class InfoToggle extends Component {
    funcCode = 8;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        selected:false,
        active:false
    }
    setImg = (img) =>{
        this.setState({
            img: img
        })
    }

    checkSelected = (selected) =>{
        if(selected)
            this.setImg(this.SELECTED_IMG);
        else{
            this.setImg(this.IMG);
        }
    }

    handleOnClickOption = () => {
        this.setState({
            selected: !this.state.selected
        })
    };

    render(){
        const {active,selected} = this.state;
        const nameLang = selected ? 'horizontalBarComponent.InfoToggle.active' : 'horizontalBarComponent.InfoToggle.deactive';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(this.state.selected)} >
                <img src={this.state.img} alt='' />
                 <Tooltip descLang={nameLang} />
            </button>
        );
    }
}


function mapStateToProps(state) {
    const { authentication: {user} } = state;
    return {
        user
    };
}
const mapDispatchToProps = (dispatch) => ({
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
});

export default connect(mapStateToProps,mapDispatchToProps)(InfoToggle)