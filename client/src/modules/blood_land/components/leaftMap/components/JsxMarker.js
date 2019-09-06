
import React, { Component } from 'react';

export default class JsxMarkerComponent extends Component {
    constructor(props) {
        super(props);
    }

    
    clicked() {
        console.log("vcl");
    }

    componentDidMount = () => {
        console.log("heheheh");
    }

    render() {
        return (
            <button style={{'zIndex':999}}  ref={(element) => { this.element = element; }} onClick={this.clicked}>Hien ne</button>
        );
    }
}