import React, {useState , useEffect} from 'react'
import classNames from "classnames"
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledDropdown} from "../../../../components/customStyled/Dropdown_style";
import {InputSwitchStyle} from "../../../../components/customStyled/InputSwitch_style";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";

const OptionList = [
    {
        label: '배경음악',
        type: 'music'
    },
    {
        label: '맵 정보',
        type: 'mapInfo'
    },{
        label: '리모콘 사용',
        type: 'zoomOption'
    },
    {
        label: '언어',
        type: 'language',
        languageList: [
            {
                label: 'English',
                value: 'Eng'
            },
            {
                label: '한국어',
                value: 'Kr'
            },
            {
                label: 'Tiếng Việt',
                value: 'Vi'
            }
        ]
    }
];
const SettingComponent = () => {
    const dispatch = useDispatch();
    const { settings } = useSelector(state => state);
    console.log("settings", settings);
    const [language , setLanguage] = useState();
    const [statusOption , setStatusOption] = useState({});
    const settingClass = classNames({
        'setting -container': true,
        'fadeIn': true,
        'fadeOut': false
    });



    return(
        <div className={settingClass}>
            <div className='setting__option-container'>
                <div className='setting__option __title'>
                    <div className='title__icon'>
                        <img alt='setting' src={loadingImage('../images/bloodLandNew/setting/setting-icon.png')}/>
                    </div>
                    <div className='title__name'>
                        설정
                    </div>
                    <div className='title__button' onClick={() => dispatch(screenActions.removePopup({name: 'setting'}))}>
                        <div><div/></div>
                    </div>
                </div>
                <div className='setting__option __line'/>
                <div className='setting__option __option-selector'>
                    {OptionList.map((item , index) => {
                        const {type , languageList , label} = item;
                        return(
                            <div className='__option-selector-container' key={index}>
                                <div className='__option-selector-name'>
                                    {label}
                                </div>
                                <div className='__option-selector-checked'>
                                    {!languageList ?  <InputSwitchStyle checked={statusOption[type]} onChange={(e) => setStatusOption(preState => ({...preState, [type]:e.value}))}/>
                                    : <StyledDropdown optionLabel="label" value={language} options={languageList} onChange={(e) => {setLanguage(e.value)}}/>}

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='setting__version-container'>
                <div className='__title'>
                    로그아웃
                </div>
                <div className='__version'>
                    버전 0.3.2
                </div>
                <div className='__version-id'>
                    1908140225
                </div>
            </div>
        </div>
    )
};
export default SettingComponent
