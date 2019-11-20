import React, {Fragment,useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Tooltip from "../../general/Tooltip";
import { mapActions } from "../../../../../store/actions/commonActions/mapActions";

const list = [
    {
        tab : 1,
        name: 'one',
        className : 'special-child-land',
        content : ' 1 LAND'
    },
    {
        tab : 2,
        name: 'plus',
        className : 'special-child-land',
        content : ' + LAND'
    },
    {
        tab : 3,
        name: 'three',
        className : 'special-child-land',
        content : ' 3 LAND'
    },
    {
        tab : 4,
        name: 'equal',
        className : 'special-child-land',
        content : '  = LAND '
    },
    {
        tab : 5,
        name: 'B',
        className : 'special-child-land',
        content : '  B LAND '
    }
]
const SpecialLand = () => {
    const dispatch = useDispatch();
    const { lands } = useSelector(state => state);
    const [active, setAction] = useState(false);
    const handleOnClickOption = (name) => {

      //console.log('tab--name', name);
      const landSpecial = lands.landSpecials.find(landSP => landSP.name === name);
      //console.log("landSpecial", landSpecial);
      if(landSpecial && landSpecial.center){
        dispatch(mapActions.syncCenterMap(landSpecial.center, 8))
      }
      setAction(false);

    }
    return (
      <Fragment>
          <button className={`${active ? 'active' : ''} game-func-btn special-land`} onClick={()=> setAction(!active)}
                  onMouseEnter={''}
                  onMouseOut  ={''} >
              SPECIAL LAND
          </button>
          {active && <div className={'list-special-land'}>
              {list && list.map((value,ind) => {
                  return(
                      <div key={ind} className={value.className} onClick={() => handleOnClickOption(value.name)}> {value.content} </div>
                  )
              })}
          </div>}
      </Fragment>
    )
}
export default SpecialLand;