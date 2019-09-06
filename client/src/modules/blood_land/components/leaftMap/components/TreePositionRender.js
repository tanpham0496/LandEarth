import React, { Fragment, PureComponent, useMemo } from 'react'
import { getMapImgByItemId } from "../../../../../helpers/thumbnails";
import moment from 'moment';
import _ from 'lodash';

const alertPopup = {
    detailTreePopup: 'detailTreePopup',
    cultivationTreePopup: 'cultivationTreePopup'
};

function TreePositionRender(props){
    return useMemo(() => {
        const { landCharacters, quadKey, toggleHiddenCharacterStatus, user: { _id }, tree } = props;
        if(!tree) return null;
        
        const { itemId, waterEndTime } = tree;
        const waterEndHours = waterEndTime && moment(waterEndTime).diff(moment(), "hours");
        const waterEndDayRemaining = _.isNumber(waterEndHours) ? Math.ceil(waterEndHours/24) : null;
        //console.log('waterEndDayRemaining', waterEndDayRemaining);
        return (
            <Fragment>
                    {/*toggleTree && item.userId === _id &&
                    <div className={`${itemId === 'T10' ? 'toggle-special-tree-button' : 'toggle-tree-button'}`} onClick={() => this.onHandleCheckPopup(item)}>
                        <img src={getMapImgByItemId(itemId)} alt=''/>
                    </div>*/}
                    <div className={`game-obj ${itemId === 'T10' ? 'pos-special-item' : 'pos-item'}`} onClick={() => this.onHandleClick(itemId)}>

                        {_.isNumber(waterEndDayRemaining) && <div className={`char-status ${waterEndDayRemaining <= 15 ? 'water-warning' : ''} `}  />}
                        <img className={`${itemId === 'T10' ? 'char-special-img' : 'char-img'}`}
                             src={getMapImgByItemId(itemId)} alt={itemId}/>
                    </div>
            </Fragment>
        )
    });
}
export default TreePositionRender;

// class TreePositionRender extends PureComponent {
//     //state = {};
//     // onHandleFilterPositionTree = (landCharacters, quadKey) => {
//     //     //console.log('landCharacters, quadKey', landCharacters, quadKey)
//     //     let positionSelected = [];
//     //     if (landCharacters.length > 0) {
//     //         for (let i = 0; i < landCharacters.length; i++) {
//     //             if (landCharacters[i].quadKey === quadKey) {
//     //                 const param = {
//     //                     ...landCharacters[i]
//     //                 };
//     //                 positionSelected.push(param)
//     //             }
//     //         }
//     //     }
//     //     if(positionSelected.length > 0) console.log('positionSelected', positionSelected);
//     //     return positionSelected;
//     // };

//     // onHandleClick = () => {
//     //     this.setState({
//     //         toggleTree: !this.state.toggleTree
//     //     });
//     //     setTimeout(() => {
//     //         this.setState({
//     //             toggleTree: false
//     //         })
//     //     }, 5000)
//     // };

//     onHandleCheckPopup = (item) => {
//         const { user: { _id }, handleShowPopupForTree } = this.props;
// //         if (item.userId === _id) {
//             handleShowPopupForTree({ item, checkPopup: alertPopup.cultivationTreePopup })
//         } else {
//             handleShowPopupForTree({ item, checkPopup: alertPopup.detailTreePopup })
//         }
//     };
// }

