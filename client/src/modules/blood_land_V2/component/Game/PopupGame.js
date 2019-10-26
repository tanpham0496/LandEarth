import React, {Fragment, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {  Modal } from 'reactstrap';
import {loadingImage} from "../../../blood_land/components/general/System";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";

const listGame = [
    {
        name : ' LOOD Worm',
        img : '/images/bloodLandNew/icon-game.png',
        class : 'img-game',
        titleClass : 'title-game',
        tab: '1'
    },
    {
        name : ' LOOD Worm',
        img : '/images/bloodLandNew/icon-game.png',
        class : 'img-game',
        titleClass : 'title-game',
        tab: '2'
    },
    {
        name : ' LOOD Worm',
        img : '/images/bloodLandNew/icon-game.png',
        class : 'img-game',
        titleClass : 'title-game',
        tab: '3'
    },
    {
        name : ' LOOD Worm',
        img : '/images/bloodLandNew/icon-game.png',
        class : 'img-game',
        titleClass : 'title-game',
        tab: '4'
    },
    {
        name : ' LOOD Worm',
        img : '/images/bloodLandNew/icon-game.png',
        class : 'img-game',
        titleClass : 'title-game',
        tab: '5'
    }
]
function PopupGame(props) {
    const dispatch = useDispatch();
    // const {screens} = useSelector(state => state);
     return(
          <Fragment>
              <Modal isOpen={true} className={'Game-container'}>
                  <div className={'header-game'}>
                      <div className={'header-child-game'}>
                          <img alt={'image logo game Blood Land'} src={loadingImage('/images/bloodLandNew/icon-logo-game.png')}/>
                          <div>게임</div>
                          <div className='button-header'
                               onClick={() => dispatch(screenActions.removePopup({names: ['game']}))}>
                              <div className='button-return'>
                                  <div className='icon-button'/>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className={'body-game'}>
                      <div className={'amount-game'}>게임 목록 {listGame.length} 개게임 </div>
                      <div className={'list-item'}>
                          {listGame && listGame.map((value,ind) => {
                               return (
                                   <div className={'item-game'} key={ind} onClick={()=> console.log('game',value.tab)}>
                                       <img alt={value.class}  className={value.class} src={loadingImage(`${value.img}`)} />
                                       <div className={'title-game'}> {value.name} </div>
                                   </div>
                               )
                          })}
                      </div>
                  </div>
              </Modal>
          </Fragment>
     )
}
export default PopupGame;