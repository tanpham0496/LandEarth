import StyledComponent from '../style-component'
import styled from "styled-components";
import {InputText} from "primereact/inputtext";


export const StyledInputText = styled(StyledComponent(InputText))`
  .p-inputtext {
    font-size: 12px;
    margin-top: 0px;
    width: 100px;
    height: 17px;
    color: #333333;
    background: #ffffff;
    padding: 0.429em;
    border: 1px solid #a6a6a6;
    -o-transition: border-color 0.2s;
    -webkit-transition: border-color 0.2s;
    transition: border-color 0.2s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 3px;
  }
`;