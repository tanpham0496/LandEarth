import StyledComponent from '../style-component'
import styled from "styled-components";
import {Checkbox} from 'primereact/checkbox';

export const StyledCheckbox2 = styled(StyledComponent(Checkbox))`
   .p-checkbox .p-checkbox-box{
         border: 3px solid #12354F;
         width: 17px;
         height: 17px;
         margin-top: 1px;
         border-radius: 50%
   }
   .p-checkbox .p-checkbox-box .p-checkbox-icon {
        display: none
    }
    .p-checkbox .p-checkbox-box.p-highlight {
        border-color: #12354F;
        background-color: #2EE59D ;
        color: #ffffff;
    }
    .p-checkbox .p-checkbox-box.p-highlight:not(.p-disabled):hover {
        border-color: #12354F;
        background-color: #2EE59D ;
        color: white;
    }
  
`;
