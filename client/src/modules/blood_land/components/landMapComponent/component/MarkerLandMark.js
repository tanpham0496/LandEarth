import React, {PureComponent} from 'react';

class MarkerLandMark extends PureComponent {
    render() {
        return (
            <div className='landmark-marker-container'>
                <div className='landmark-name'>{this.props.landmark && this.props.landmark.name}</div>
                <div className="marker-landmark">
                    <div className="marker-landmark-plus"/>
                </div>
            </div>
        )
    }
}

export default MarkerLandMark;