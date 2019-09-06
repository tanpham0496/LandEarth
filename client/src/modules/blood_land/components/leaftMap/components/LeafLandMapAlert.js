// import {loadingImage, QuadKeyToLatLong} from "../../general/System";
// import {Modal} from "reactstrap";
// import React, {Fragment} from "react";
// // import moment from "moment";
// import GoogleMap from 'google-map-react';
// import TranslateLanguage from "../../general/TranslateComponent";
// import { formatCharacter } from './LeafMapFunction';


// export const getCertificateAlertPopup = (isOpenCertificateImage, tile, onHandleHideCertificateImage, user, landInfo) => {


// };


// function LandCertificateComponent(props){
//     const { isOpenCertificateImage, tile, onHandleHideCertificateImage, user, landInfo } = props;

//     const {status, info} = landInfo;
//     if (status && info) {
//         const { purchaseDateFormat, latlng: { lat, lng } } = info;
//         //const {purchaseDate} = lands[0];
//         //const purchaseDateFormat = moment(purchaseDate).format('DD-MM-YYYY');
//         return (
//             <Modal isOpen={isOpenCertificateImage} backdrop="static"
//                    className={`custom-modal modal--certificate`}>
//                 <span className="lnr lnr-cross lnr-custom-close" onClick={() => onHandleHideCertificateImage()}/>
//                 <div className='certificate'>
//                     <div className='certificate-content'>
//                         <div>
//                             ID
//                             : {user && user.wId && user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}
//                         </div>
//                         <div style={{display: 'flex'}}>
//                             <div>LOCATION :</div>
//                             <div>
//                                 Latitude {lat} <br/>
//                                 Longitude {lng}
//                             </div>
//                         </div>
//                     </div>
//                     <div className='certificate-date'>
//                         {purchaseDateFormat}
//                     </div>
//                     <div className='certificate-signature'>
//                         {/*<img src={process.env.PUBLIC_URL + `/images/bloodland-ui/sample-signature.png`} alt=''/>*/}
//                     </div>
//                 </div>
//             </Modal>
//         )
//     }
// }

// export default connect( 
//     state => {
//         const { authentication: { user }, lands } = state;
//         return { user, lands };
//     },
//     dispatch => ({
//         getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
//         //getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
//         syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
//         //addSelected: (multiSelectSave) => dispatch(mapActions.addSelected(multiSelectSave)),
//         //selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
//         //clearSelected: () => dispatch(mapActions.clearSelected())
//     })
// )(LandCertificateComponent);