import React, {PureComponent, Fragment} from 'react'
import cloneDeep from "lodash.clonedeep";
import {Modal} from 'reactstrap';
import {loadingImage} from "../../../general/System";
import LandList from "./component/landList";
import {checkMoveLand} from "../../../gameUIComponent/MyLand/LandManagementNew/component/landManagementFunction";
import {landActions} from "../../../../../../store/actions/landActions/landActions";
import {connect} from 'react-redux'
import isEqual from 'lodash.isequal'
import differenceBy from 'lodash.differenceby'
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert";
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";
import NotCategorySelectedAlert from "../../Popups/MoveLandPopups/NoCategorySelectedAlert"
import MaxAmountLandAlert from "../../Popups/MoveLandPopups/MaxAmountLandAlert"
import MoveLandConfirmAlert from "../../Popups/MoveLandPopups/MoveLandConfirmAlert"
import MoveLandSuccessAlert from "../../Popups/MoveLandPopups/MoveLandSuccessAlert";

class MoveLand extends PureComponent {
    state = {};

    componentDidMount() {
        const {selectedLands} = this.props;
        if (selectedLands) {
            const selectedLandsUpdate = cloneDeep(selectedLands);
            selectedLandsUpdate.map(l => {
                l.checked = false;
                return l
            });
            this.setState({
                selectedLandsState: selectedLandsUpdate
            })
        }

    }

    componentDidUpdate(prevProps , prevState) {
        const { categoryLandList , resultMoveLand , addPopup} = this.props;
        const {selectedLandsState} = this.state;
        const {landCanMove} = this.state;
        if (!isEqual(categoryLandList, prevProps.categoryLandList) && landCanMove && selectedLandsState && resultMoveLand){
            const selectedLandsUpdate = differenceBy(selectedLandsState, landCanMove , 'quadKey');
            this.setState({
                selectedLandsState: selectedLandsUpdate
            })
            resultMoveLand && setTimeout(() => {
                addPopup({name: "MoveLandSuccessAlert" , close: 'LoadingPopup',  data: {selectedLandsState}})
            }, 500)
        }

    }
    onHandleCheckAll = (e) => {
        const {selectedLandsState} = this.state;
        const selectedLandsUpdate = cloneDeep(selectedLandsState);
        selectedLandsUpdate.map(l => {
            l.checked = e.checked;
            return l
        })
        this.setState({
            checkStatus: true,
            checkAll: e.checked,
            selectedLandsState: selectedLandsUpdate
        });
    };
    onHandleCheckLand = (e) => {
        const {selectedLandsState} = this.state;

        let selectedLandsUpdate = cloneDeep(selectedLandsState);
        let landSelected = {
            ...selectedLandsUpdate.find(l => l._id === e.value._id),
            checked: !e.value.checked
        };

        selectedLandsUpdate.splice(selectedLandsUpdate.findIndex(l => l._id === e.value._id), 1, landSelected);
        const checkAllLength = selectedLandsUpdate.filter(l => l.checked).length === selectedLandsState.length;
        this.setState({
            checkStatus: true,
            checkAll: checkAllLength,
            selectedLandsState: selectedLandsUpdate
        });
    };

    onHandleCheckMoveLand = (categorySelected , categories) => {
        const {selectedLands , user:{_id}, addPopup} = this.props;
        const {selectedLandsState} = this.state;
        const selectedLandsClone = cloneDeep(selectedLandsState);
        const landSelectedMove = selectedLandsClone.filter(l => l.checked);
        const landCanMove = checkMoveLand(landSelectedMove , categories , categorySelected , selectedLands[0].categoryId , addPopup );

        if(landCanMove){
            // oldCateId, newCateId, userId, quadKeys
            const landCanMoveQuadKeys =  landCanMove.map(l => {return l.quadKey});
            const param = {
                userId: _id,
                quadKeys: landCanMoveQuadKeys,
                oldCateId:  selectedLands[0].categoryId,
                newCateId: categorySelected._id
            };
            this.setState({
                landCanMove: landCanMove,
                paramMoveLand: param
            })

        }
    };

    onHandleMoveLand = () => {
        const {paramMoveLand} = this.state;
        const {user: {_id} , addPopup} = this.props;
        if(paramMoveLand){
            this.props.transferLandCategory(paramMoveLand);
            this.props.getAllLandCategoryNew({userId: _id});
            addPopup({name: 'LoadingPopup'})
        }
    }

    alertPopupRender = () => {
        const {screens} = this.props;
        return (
            <Fragment>
                {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
                {screens['NotCategorySelectedAlert'] && <NotCategorySelectedAlert/>}
                {screens['MaxAmountLandAlert'] && <MaxAmountLandAlert/>}
                {screens['MoveLandConfirmAlert'] && <MoveLandConfirmAlert onHandleMoveLand={this.onHandleMoveLand}/>}
                {screens['MoveLandSuccessAlert'] && <MoveLandSuccessAlert/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
            </Fragment>
        )
    };
    moveLandRender = () => {
        const { selectedLands , removePopup} = this.props;
        const {selectedLandsState, checkAll} = this.state;
        return (
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--land-sell`}
                   style={{width: '19rem'}}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-sell-land.svg')} alt=''/>
                    Move
                    {/*<TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.sell'}/>*/}
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => removePopup({name: 'moveLand'})}/>
                </div>
                <div className='custom-modal-body'>
                    {!selectedLandsState ? <div>loading</div> : <LandList
                        categoryId={selectedLands[0].categoryId}
                        checkAll={checkAll}
                        onHandleCheckMoveLand={this.onHandleCheckMoveLand}
                        onHandleCheckAll={this.onHandleCheckAll}
                        selectedLands={selectedLandsState}
                        handleHidePopup={this.props.handleHidePopup}
                        onHandleCheckLand={this.onHandleCheckLand}/>}
                </div>
            </Modal>
        )
    }

    render() {
        return (
            <Fragment>
                {this.moveLandRender()}
                {this.alertPopupRender()}
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    const { authentication: {user}, lands: {categoryLandList , resultMoveLand} , screens} = state;
    return {
        user , categoryLandList , resultMoveLand , screens
    }
};
const mapDispatchToProps = (dispatch) => ({
    getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
    transferLandCategory: (param) => dispatch(landActions.transferLandCategoryNew(param)),
    removePopup: (screen) =>  dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) =>  dispatch(screenActions.addPopup(screen))
});
export default connect(mapStateToProps , mapDispatchToProps)(MoveLand)