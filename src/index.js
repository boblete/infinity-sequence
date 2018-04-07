import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'
import '../css/main.scss';
import Tone from 'tone';

//create an audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext

// export for others scripts to use
window.Tone = Tone;


ReactDOM.render(<App />, document.getElementById('root'));
