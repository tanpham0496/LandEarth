import React , {Fragment} from "react";

const LoadingSymbolComponent  = () => {
    return(
        <Fragment>
            <div className="center"/>

            <div className="inner-spin">

                <div className="inner-arc inner-arc_start-a"/>
                <div className="inner-arc inner-arc_end-a"/>

                <div className="inner-arc inner-arc_start-b"/>
                <div className="inner-arc inner-arc_end-b"/>

                <div className="inner-moon-a"/>
                <div className="inner-moon-b"/>

            </div>

            {/*<div className="outer-spin">*/}

            {/*    <div className="outer-arc outer-arc_start-a"/>*/}
            {/*    /!*<div className="outer-arc outer-arc_end-a"/>*!/*/}

            {/*    <div className="outer-arc outer-arc_start-b"/>*/}
            {/*    /!*<div className="outer-arc outer-arc_end-b"/>*!/*/}

            {/*    <div className="outer-moon-a"/>*/}
            {/*    /!*<div className="outer-moon-b"/>*!/*/}

            {/*</div>*/}
        </Fragment>
    )
};
export default LoadingSymbolComponent
