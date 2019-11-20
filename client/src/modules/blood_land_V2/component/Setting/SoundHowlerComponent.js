import React, {Component, Fragment , memo} from 'react';
import ReactHowler from 'react-howler';
import moment from 'moment';
// import _ from 'lodash';
// import {connect, useSelector} from 'react-redux';
const MORNING = `${process.env.PUBLIC_URL}/sounds/homemade_kooky_morning.mp3`;
const EVERNING = `${process.env.PUBLIC_URL}/sounds/vintage_vibrations_evening.mp3`;

const SoundHowlerComponent = memo((props) => {

    const { bgMusic } = props;
    const diffTime = moment().diff(moment({hour: 5}));
    //43200000 = 12*60*60*1000 
    const curSound = diffTime > 0 && diffTime < 43200000 ? MORNING : EVERNING;

    return (
        <ReactHowler
            src={curSound}
            playing={true}
            volume={bgMusic.volume / 100}
        />
    )
});

export default SoundHowlerComponent;