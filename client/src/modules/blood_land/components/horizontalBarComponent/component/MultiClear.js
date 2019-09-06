// import React, {Component} from 'react'
// import {connect} from "react-redux";
// import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
// import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
// import {loadingImage} from "../../general/System";
// import Tooltip from './../../general/Tooltip';
// import { newVersionUI } from '../../../../../helpers/config';

// const obj = {
//     funcCode: 1,
//     IMG: loadingImage(`/images/funcs/func-${1}.svg`),
//     SELECTED_IMG:  loadingImage(`/images/funcs/func-${1}-selected.svg`),
// }

// class MultiClear extends Component {

//     state = {
//         img: obj.IMG,
//         active: true
//     }

//     async componentWillReceiveProps(nextProps){
//         this.setState({ img: nextProps.selected ? obj.SELECTED_IMG : obj.IMG });
//         if(!newVersionUI) this.setState({ active: !nextProps.gameMode });
//     }

//     handleOnClickOption = () => {
//         const {lands} = this.props;
//         if(lands && lands.landLoading === false){
//             this.props.selectMode('multiclear');
//             this.props.handleFuncSelect(obj.funcCode);
//         }
//     };

//     render(){
//         const {active} = this.state;
//         const nameLang = 'horizontalBarComponent.MultiClear'
//         return(
//             <button className={`game-func-btn  ${!active ? 'deactive' : 'none'}`} onClick={() => active &&  this.handleOnClickOption()}
//                                                 onMouseEnter={() => active && this.setState({ img: obj.SELECTED_IMG }) }
//                                                 onMouseOut  ={() => active && this.setState({ img: this.props.selected ? obj.SELECTED_IMG : obj.IMG }) } >
//                 <img src={this.state.img} alt='' />
//                  <Tooltip descLang={nameLang} />
//             </button>
//         );
//     }
// }

// export default connect(
//     state => {
//         const { authentication: { user },map, settings:{ gameMode }, lands} = state;
//         return { user, gameMode, map, lands };
//     },
//     dispatch => ({
//         selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
//     })
// )(MultiClear)
