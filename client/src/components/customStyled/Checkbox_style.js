import StyledComponent from '../style-component'
import styled from "styled-components";
import {Checkbox} from 'primereact/checkbox';

export const StyledCheckbox = styled(StyledComponent(Checkbox))`
   .p-checkbox .p-checkbox-box{
         width: 17px;
         height: 17px;
         margin-top: 1px;
   }
   .p-checkbox .p-checkbox-box .p-checkbox-icon {
        overflow: hidden;
        position: relative;
        font-size: 13px;
        margin-top: 1px;
    }
    .p-checkbox .p-checkbox-box.p-highlight {
        border-color: #990000;
        background-color:#AC0000 ;
        color: #ffffff;
    }
    .p-checkbox .p-checkbox-box.p-highlight:not(.p-disabled):hover {
         border-color: #990000;
        background-color:#AC0000 ;
        color: white;
    }
    // .p-checkbox .p-checkbox-box.p-highlight {
    //     border-color: none !important;
    //     background-color:  white !important;
    //     color: black;
    // }
`;
