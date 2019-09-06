import StyledComponent from "../style-component";
import styled from "styled-components";
import { Dropdown } from "primereact/dropdown";

export const StyledDropdown = styled(StyledComponent(Dropdown))`
  .p-dropdown {
    width: auto !important;
    height: auto !important;
    border-radius: 63px !important;
    border: none;
  }
  .p-dropdown .p-dropdown-trigger {
    border-radius: 10px;
    width: 33px;
    background: #efeeee;
  }
  .p-dropdown-trigger .p-dropdown-trigger-icon {
    position: unset !important;
    margin: unset !important;
    width: 0.7rem;
    height: 0.7rem;
    background: url("/images/bloodland-ui/dropdown-btn-bg.svg") no-repeat center;
  }
  .p-dropdown-trigger .p-dropdown-trigger-icon:before {
    content: none;
  }
  .p-inputtext {
    border-radius: 6px;
    padding-left: 10px;
    font-size: 11px;
    width: 160px !important;
    color: black;
    background: #efeeee;
  }
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background: #ac0000 !important;
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
