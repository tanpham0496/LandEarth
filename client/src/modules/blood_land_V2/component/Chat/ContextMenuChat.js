import React, { useState, useRef, useEffect,Fragment } from 'react'
// import {connect , useDispatch} from "react-redux";
function ContextMenuChat({listContext , changeLocation}) {

   const root = useRef();

   useEffect(()=> {
       _handleClickContextChat(changeLocation);
   }, [changeLocation]);
   
   const _handleClickContextChat = (changeLocation) => {
       const clickX = changeLocation.clientX;
       const clickY = changeLocation.clientY;
       const screenW = window.innerWidth;
       const screenH = window.innerHeight;
       const rootW = root.current.offsetWidth;
       const rootH = root.current.offsetHeight;

       const right = (screenW - clickX) > rootW;
       const left = !right;
       const top = (screenH - clickY) > rootH;
       const bottom = !top;
       //set location show contentMenu when click
       if (right) {
           root.current.style.left = `${clickX + 5}px`;
       }

       if (left) {
           root.current.style.left = `${clickX - rootW - 5}px`;
       }

       if (top) {
           root.current.style.top = `${clickY + 5}px`;
       }

       if (bottom) {
           root.current.style.top = `${clickY - rootH - 5}px`;
       }
   };

   const handleContextChild = (tab) => {
      console.log('tab',tab);
   }
   
   return (
       <Fragment>
          <div ref={root} className="contextMenuchat" id={'contextMenuchat'} >
              {listContext && listContext.map((value,ind) => {
                  const {name, tab} = value;
                  return(
                      <div key={ind} className={'menuContext-child'} onClick={()=>handleContextChild(tab)}>
                          {name}
                      </div>
                  )
              })}
           </div>
       </Fragment>
   )
}
export default ContextMenuChat;