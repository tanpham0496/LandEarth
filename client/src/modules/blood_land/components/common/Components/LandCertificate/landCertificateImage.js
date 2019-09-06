import {Modal} from "reactstrap";
import React from "react";
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {mapActions} from "../../../../../../store/actions/commonActions/mapActions";
import {landActions} from "../../../../../../store/actions/landActions/landActions";
import {connect} from "react-redux";

const formatCharacter = (name) => {
    if (!name) return "";
    const nameLength = name && name.length;
    return name.slice(0, Math.ceil(nameLength * 0.3)).padEnd(nameLength, 'X');
};


const LandCertificateImage = (props) => {
    const {removePopup, landInfo, user  } = props;


    const {info: {purchaseDateFormat, latlng: { lat, lng }} , info} = landInfo;
    return (
        <Modal isOpen={true} backdrop="static"
               className={`custom-modal modal--certificate`}>
            <span className="lnr lnr-cross lnr-custom-close" onClick={() => removePopup({name: 'LandCertificateImage'})}/>
            <div className='certificate'>
                <div className='certificate-content'>
                    <div>ID : {user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}</div>
                    <div style={{display: 'flex'}}>
                        <div>LOCATION :</div>
                        <div>
                            Latitude {lat} <br/>
                            Longitude {lng}
                        </div>
                    </div>
                </div>
                <div className='certificate-date'>
                    {purchaseDateFormat}
                </div>
                <div className='certificate-signature'>
                    {/*<img src={process.env.PUBLIC_URL + `/images/bloodland-ui/sample-signature.png`} alt=''/>*/}
                </div>
            </div>
        </Modal>
    )

};

const mapStateToProps = (state) => {
    const {lands: {landInfo}, authentication: {user}, settingReducer: {gameMode}, map  } = state;
    return {
        landInfo, user, gameMode, map
    }
};

const mapDispatchToProps = (dispatch) => ({
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    syncCenterMap: (center, zoom, centerQuadKey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey)),
    saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandCertificateImage)