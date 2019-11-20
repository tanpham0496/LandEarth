import React, {useState , useEffect, Fragment} from 'react'
import classNames from "classnames"
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledDropdown} from "../../../../components/customStyled/Dropdown_style";
import {InputSwitchStyle} from "../../../../components/customStyled/InputSwitch_style";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import { Modal } from 'reactstrap';
import {
    settingActions, TranslateLanguage
} from '../../../../helpers/importModule';

const OptionList = [
    {
        label: <TranslateLanguage direct={'menuTab.setting.backgroundMusic'}/>,
        type: 'music'
    },
    {
        label: <TranslateLanguage direct={'menuTab.setting.mapInfo'}/>,
        type: 'mapInfo'
    },
    {
        label: <TranslateLanguage direct={'infoCurrentZoom.zoom'}/>,
        type: 'zoomOption'
    },
    {
        label:<TranslateLanguage direct={'menuTab.setting.language'}/>,
        type: 'language',
        languageList: [
            {
                label: 'English',
                value: 'en'
            },
            {
                label: '한국어',
                value: 'kr'
            },
            {
                label: 'Tiếng Việt',
                value: 'vi'
            }
        ]
    }
];
const SettingComponent = () => {
    const dispatch = useDispatch();
    const { settings: { bgMusic, land, language, landsPerCellInfo }, auth: {user} } = useSelector(state => state);
    // console.log("language", language);
    const languageOptions = OptionList.find(opt => opt.type === 'language');
    const defaultLanguage = languageOptions.languageList.find(l => l.value === language);
    // console.log("defaultLanguage", defaultLanguage);
    const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
    const [statusOption, setStatusOption] = useState({ mapInfo: land && land.showInfo, music: bgMusic && bgMusic.turnOn, zoomOption: landsPerCellInfo });
    const settingClass = classNames({
        'setting -container': true,
        'fadeIn': true,
        'fadeOut': false
    });

    const _onChangeSetting = (e, type) => {
        
        if(type === 'music'){
            dispatch(settingActions.setBgMusic({
                userId: user._id,
                bgMusic: { ...bgMusic, turnOn: e.value }
            }));
        } else if(type === 'mapInfo'){
            dispatch(settingActions.setLandShowInfo({
                userId: user._id,
                land: { showInfo: e.value }
            }))
        } else if(type === 'zoomOption'){
            dispatch(settingActions.setLandsPerCellInfo({
                userId: user._id,
                landsPerCellInfo: e.value
            }))
        }
        setStatusOption(preState => ({...preState, [type]: e.value}));

    };

    const _onChangeLanguageSetting = (e, type) => {
        
        dispatch(settingActions.setLanguage({
            userId: user._id,
            language: e.value.value
        }));
        setCurrentLanguage(e.value);

    };

    return(
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={'setting-modal'}>
                <div className={settingClass}>
                    <div className='setting__option-container'>
                        <div className='setting__option __title'>
                            <div className='title__icon'>
                                <img alt='setting' src={loadingImage('../images/bloodLandNew/setting/setting-icon.png')}/>
                            </div>
                            <div className='title__name'>
                                <TranslateLanguage direct={'menuTab.setting'}/>
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
                                            {!languageList ? <InputSwitchStyle checked={statusOption[type]} onChange={(e) => _onChangeSetting(e, type)}/>
                                            : <StyledDropdown optionLabel="label" value={currentLanguage} options={languageList} onChange={(e) => _onChangeLanguageSetting(e, type)}/>}

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
            </Modal>
        </Fragment>

    )
};
export default SettingComponent
