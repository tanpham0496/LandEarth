import React, {Component, Fragment} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';
import NotificationBlood from "../../common/Components/AdsToggle/index"
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import {notification} from "../../../../../helpers/config"


class AdsToggle extends Component {
    funcCode = 9;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        selected:false,
        active:false
    };
    setImg = (img) =>{
        this.setState({
            img: img
        })
    };

    checkSelected = (selected) =>{
        if(selected)
            this.setImg(this.SELECTED_IMG);
        else{
            this.setImg(this.IMG);
        }
    };

    handleOnClickOption = () => {
        this.setState({
            selected: !this.state.selected
        })
    };
    handleShowInputNotice = () => {
        setTimeout(()=>{
            this.props.removePopup({name : "ContextMenu"});
        },0.01);
        this.props.addPopup({name : 'NotificationBlood'});
    };

    render(){
        const {active} = this.state;
        const {screens,notifies,develops} = this.props;
        const haveNotify = notifies && notifies.length > 0 && notifies.filter(nt => nt.read === false);
        const haveDevelop = develops && develops.length > 0 && develops.filter(dv => dv.read === false);
        return(
            <Fragment>

                {notification ? ( <button className={`game-func-btn`} onClick={() => this.handleShowInputNotice()}
                             onMouseEnter={() => this.setImg(this.SELECTED_IMG)}
                             onMouseOut  ={() => this.checkSelected(this.state.selected)}
                    >
                        {( (haveNotify && haveNotify.length > 0) || (haveDevelop && haveDevelop.length > 0) ) && <div className={'has-new'}> New </div>}
                        <img src={this.state.img} alt='' />
                    </button>   )
                    :
                    (<button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                             onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                             onMouseOut  ={() => active && this.checkSelected(this.state.selected)}>
                        <img src={this.state.img} alt='' />
                        <Tooltip descLang={'horizontalBarComponent.AdsToggle'} />
                    </button>)
                }
                {screens['NotificationBlood'] && <NotificationBlood />}
            </Fragment>

        );
    }
}

export default connect(
    state=> {
        const { authentication: {user} ,screens, notify : {notifies},develop : {develops}} = state;
        return {
            user,
            screens,
            notifies,
            develops
        };
    },
    dispatch => ({
        selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(AdsToggle)