import StyledComponent from '../style-component'
import styled from "styled-components";
import {InputSwitch} from 'primereact/inputswitch';

export const InputSwitchStyle = styled(StyledComponent(InputSwitch))`
  .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider{
    background: #6EF488
  }
  .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:hover{
     background: #6EF488 !important
  }
  .p-inputswitch-focus .p-inputswitch-slider{
  	background: #6EF488 !important
  }
`;
