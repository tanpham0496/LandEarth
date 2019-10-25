import React, {Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import LoadingSymbolComponent from "../common/loading";
//type
//     - Yes/No popup - considerPopup
//     - confirm popup
//     - loading popup
export const PopupRenderComponent = (props) => {
    const {type, confirm, reject} = props;
    const dispatch = useDispatch();
    const {screens} = useSelector(state => state);
    const considerPopup = type === 'consider';
    const confirmPopup = type === 'confirm';
    const loadingPopup = screens['LoadingPopup'];
    const buttonPopupClass = classNames({
        'buttonPopup-container': true,
        'active': confirmPopup
    });
    // const closePopup = () => {
    //
    // }
    const onConfirm = () => {
        confirm();
        dispatch(screenActions.addPopup({name: 'LoadingPopup'}))
    };
    return (
        <Fragment>
            <div className='fade-bg'/>
            <div className='popup-wrapper'>
                <div className='title-container'>
                    <div className='title'>
                        차단 해제
                    </div>
                    {!loadingPopup && <div className='button-close' onClick={() => reject()}>
                        <div>
                            <div/>
                        </div>
                    </div>}
                </div>
                <div className='line-container'/>
                <div className='body-container'>
                    {loadingPopup && <LoadingSymbolComponent/>}
                    {!loadingPopup && confirmPopup &&
                    <img alt='icon' src={loadingImage('/images/bloodlandNew/success-icon.png')}/>}
                    {!loadingPopup && <div className='body-content'>
                        차단 해제 하시겠습니까?
                    </div>}
                </div>
                <div className={buttonPopupClass}>
                    {considerPopup && <Fragment>
                        <div className='buttonPopup' onClick={() => onConfirm()}>네</div>
                        <div className='buttonPopup' onClick={() => reject()}>아니요</div>
                    </Fragment>}
                    {confirmPopup && <div className='buttonPopup'>네</div>}

                </div>
            </div>
        </Fragment>
    )
};

