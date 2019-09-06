import React, {Fragment, PureComponent} from 'react'

class LandStatusComponent extends PureComponent {
    render() {
        const {className} = this.props;
        const myForSell = className.indexOf('myForSell');
        const myLand = className.indexOf('myLand');
        const forSell = className.indexOf('forSell');
        const forSaleStatus = ( myForSell !== -1 && (myLand === -1 && myForSell === -1) )|| forSell !== -1;
        const myLandStatus = myLand !== -1 && myForSell === -1;
        const myLandMySale = myLand !== -1 && myForSell !== -1;
        return (
            <Fragment>
                {forSaleStatus && <div className='fs-cont-gm'>
                    <div className='fs-title'> for sale</div>
                </div>}
                {myLandStatus && <div className='ml-cont-gm'>
                    <div className='ml-title'> my land</div>
                </div>}
                {myLandMySale && <div className='fg-cont-gm'>
                    <div className='fs-cont-gm'>
                        <div className='fs-title'>sale</div>
                    </div>
                    <div className='ml-cont-gm'>
                        <div className='ml-title'>my</div>
                    </div>
                </div>}
            </Fragment>
        )
    }
}

export default LandStatusComponent
