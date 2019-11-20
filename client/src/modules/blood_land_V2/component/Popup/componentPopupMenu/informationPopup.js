import React, {useState, Fragment, useEffect, useRef}  from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Modal} from "reactstrap";
import {loadingImage} from "../../../../blood_land/components/general/System";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import {landActions, TranslateLanguage} from "../../../../../helpers/importModule";
import moment from 'moment';
const  InformationPopup = (props) => {
    const dispatch = useDispatch();
    const [rotate, setRotate ] = useState(false);
    const [toggle, setToggle ] = useState(true);
    const [loading, setLoading ] = useState(true);
    const root  = useRef();
    const { authentication: { user }, lands : {myLandAmount} } = useSelector(state => state);
    useEffect(()=> {
        root.current.addEventListener("animationend", rotatingDone);
        return ()=> {root.current.removeEventListener("animationend", rotatingDone)}
    }, [toggle]);
    const rotatingDone = () => {
        setToggle(!toggle);
        setRotate(false);
    };
    // const goldBlood = wallet && wallet.info && wallet.info.goldBlood ? parseFloat(wallet.info.goldBlood).toLocaleString() : 0;
    useEffect(() => {
        if(props.user && props.user._id) dispatch(landActions.getAllLandById(props.user._id));
        setTimeout(()=> {
            setLoading(false)
        },1000)
    }, []);
     return(
         <Fragment>
             <Modal isOpen={true} className={'information'} >
                 <div className={'custom-header'}>
                     <img src={loadingImage('/images/bloodLandNew/icon-information.png')}  />
                     <div className={'title-header'}><TranslateLanguage direct={'menuTab.user.information'}/></div>
                     <div className={'close-popup'} onClick={()=> dispatch(screenActions.removePopup({name : 'information'}))}>
                         <img className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                     </div>
                 </div>

                 <div className={rotate ? 'custom-body rotate' : 'custom-body'} ref={root} onClick={() => setRotate(true)}  >
                     {loading ? <div  className={'custom-body-loading'}>
                         <div className="lds-roller"> <div> </div><div> </div><div> </div><div> </div><div> </div><div> </div><div> </div>
                         </div> </div> :
                         <Fragment>
                             {toggle ?
                                 <div>
                                     <div className={'title-body'}> BLOODER IDENTIFICATION </div>
                                     <div className={'content-body'}>
                                         <div className={'rowId'}>
                                             <div className={'nameID'}> <TranslateLanguage direct={'menuTab.user.information.id'}/> </div>
                                             <div className={'nameID'}> {user.wId ? user.wId : user.userName} </div>
                                             <div className={'totalCell'}> {myLandAmount ? myLandAmount : 0} Cells</div>
                                         </div>
                                         <div className={'rowEmail'}>
                                             <div className={'nameEmail'}> <TranslateLanguage direct={'menuTab.user.information.email'}/>  </div>
                                             <div className={'nameEmail'}> {user.email}</div>
                                             <div className={'totalBlood'}> {user.goldBlood} <TranslateLanguage direct={'menuTab.user.information.blood'}/>   </div>
                                         </div>
                                         <div className={'private-key'}>
                                             <img className={'image-QR'} src={loadingImage('/images/bloodLandNew/QR.png')}/>
                                             <div className={'QR-Private-key'}>
                                                 <div> PRIVATE KEY </div>
                                                 <div>xxxxxxxxxxxxxxxxxxx</div>
                                                 <div>xxxxxxxxxxxxxxxxxxxx</div>
                                             </div>

                                         </div>
                                     </div>
                                     <div className={'custom-body-footer'}>
                                         <div className={'title'}> DO NOT LOSE OR SHARE THIS PRIVATE KEY</div>
                                         <div className={'date-issue'}>DAY OF ISSUE   <span>  {moment(user.createdDate).format('YYYY.MM.DD')} </span></div>
                                     </div>
                                 </div> :
                                 <div className={'IMG-Card'}>
                                     <img  src={loadingImage('/images/bloodLandNew/logo-information.png')}/>
                                 </div>
                             }
                        </Fragment>}
                        
                 </div>

             </Modal>
         </Fragment>
     )
}
export default InformationPopup;