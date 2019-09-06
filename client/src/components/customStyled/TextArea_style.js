import StyledComponent from '../style-component'
import styled from "styled-components";
import {InputTextarea} from 'primereact/inputtextarea';


export const StyledInputTextArea = styled(StyledComponent(InputTextarea))`
  .p-inputtext {
   border: none
  }
`;