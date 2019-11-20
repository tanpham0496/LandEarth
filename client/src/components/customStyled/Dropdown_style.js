import StyledComponent from "../style-component";
import styled from "styled-components";
import {Dropdown} from "primereact/dropdown";

export const StyledDropdown = styled(StyledComponent(Dropdown))`
  .p-dropdown {
    width: 7rem !important;
    height: auto !important;
    border-radius: 63px !important;
    border: 2px solid #6EF488
  }
  .p-dropdown:focus {
      outline: none;
      border-color :#6EF488 !important 
  }
  .p-dropdown .p-dropdown-trigger {
    border-radius: 28px;
    width: 10px;
    height: 10px;
    display: flex;
  
    background: rgba(110, 244, 136 , 0.7);
    margin-top: 9px;
    margin-right: 8px;
    box-shadow: 0px 2px 6px 7px rgba(110,244,136 ,0.6);
}

  }
  .p-dropdown-trigger .p-dropdown-trigger-icon {
    position: unset !important;
    margin: unset !important;
    width: 0.7rem;
    height: 0.7rem;
    background: url("/images/bloodlandNew/dropdown-icon.svg") no-repeat center;
  }
  .p-dropdown-trigger .p-dropdown-trigger-icon:before {
    content: none;
  }
  .p-inputtext {
    border-radius: 28px;
    padding-left: 10px;
    font-size: 13px;
    color: #12354F;
    font-weight: bold
  }
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background: #6EF488 !important;
  }
  .p-dropdown-item{
      display:flex;
      align-items: center;
  }
  .land-amount{
    color:red;
    font-size:12px;
  }
  .land-name{
    width: 5rem;
    margin-right: 1.2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .p-dropdown-items-wrapper{
    ::-webkit-scrollbar-thumb { background:  #AC0000 ; }
    ::-webkit-scrollbar { width: 4px!important; background: white; }
  }
 
}
`;
