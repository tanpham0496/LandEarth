import React , {Fragment} from  'react'

//Directory
    // index =>  MenuIconListComponent

const MenuIconListComponent = (props) => {
    return(
        <Fragment>
            <div className='menu-icon-container'>
                <div className='right-menu-icon-container'>
                    {props.menuIconRender('right')}
                </div>
                <div className='left-menu-icon-container'>
                    {props.menuIconRender('left')}
                </div>
            </div>
            {props.isToolTipOpen && <div className='tooltip-container'>
                {props.toolTipValue}
            </div>}
        </Fragment>
    )
};
export default MenuIconListComponent
