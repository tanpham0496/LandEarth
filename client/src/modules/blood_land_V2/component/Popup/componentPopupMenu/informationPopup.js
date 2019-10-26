import React, {useState, Fragment, useEffect, useRef}  from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Modal} from "reactstrap";
import {loadingImage} from "../../../../blood_land/components/general/System";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";

const  InformationPopup = (props) => {
    const dispatch = useDispatch();
    const [rotate, setRotate ] = useState(false);
    const [toggle, setToggle ] = useState(true);
    const root  = useRef();
    useEffect(()=> {
        root.current.addEventListener("animationend", rotatingDone);
        return ()=> {root.current.removeEventListener("animationend", rotatingDone)}
        
    }, [toggle]);
    const rotatingDone = () => {
        setToggle(!toggle);
        setRotate(false);
    }

     return(
         <Fragment>
             <Modal isOpen={true} className={'information'} >
                 <div className={'custom-header'}>
                     <img src={loadingImage('/images/bloodLandNew/icon-information.png')}  />
                     <div className={'title-header'}>개인 정보</div>
                     <div className={'close-popup'} onClick={()=> dispatch(screenActions.removePopup({name : 'information'}))}>
                         <img className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                     </div>
                 </div>

                 <div className={rotate ? 'custom-body rotate' : 'custom-body'} ref={root} onClick={() => setRotate(true)}  >
                     {toggle ?
                     <div>
                          <div className={'title-body'}> BLOODER IDENTIFICATION </div>
                             <div className={'content-body'}>
                                 <div className={'rowId'}>
                                     <div className={'nameID'}> ID </div>
                                     <div className={'nameID'}> TAN777 </div>
                                     <div className={'totalCell'}> 169 Cells</div>
                                 </div>
                                 <div className={'rowEmail'}>
                                     <div className={'nameEmail'}> Email </div>
                                     <div className={'nameEmail'}> TAN777@mgial.com </div>
                                     <div className={'totalBlood'}> 89.000.000 Blood </div>
                                 </div>
                                 <div className={'private-key'}>
                                     <img className={'image-QR'} src={loadingImage('/images/bloodLandNew/QR.png')}/>
                                     <div className={'QR-Private-key'}>
                                         <div> PRIVATE KEY </div>
                                         <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                                         <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                                     </div>

                                 </div>
                         </div>
                         <div className={'custom-body-footer'}>
                             <div className={'title'}> DO NOT LOSE OR SHARE THIS PRIVATE KEY</div>
                             <div className={'date-issue'}>DAY OF ISSUE  2019.10.24</div>
                         </div>
                     </div> :
                         <div className={'IMG-Card'}>
                             <img  src={loadingImage('/images/bloodLandNew/logo-information.png')}/>
                         </div>
                        }
                 </div>

             </Modal>
         </Fragment>
     )
}
export default InformationPopup;