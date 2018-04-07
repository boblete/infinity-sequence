import LaunchPadControl from './launchPad';
import PushControl from './push';

import Engine from '../components/engine/engine';
import * as helpers from '../utils/helpers';

let midiDevices  = [];
let midi = null;
function initDevices(actions) {
    let inputs = midi.inputs.values();
    let outputs = midi.outputs.values();

    for (let input of inputs) {
        let output = outputs.next().value;

        if(output.name){
            while (output.name !== input.name && !input.done) {
                output = outputs.next().value;
                if(output===undefined){
                    return;
                }
            }
        }

        if (input.name.indexOf("Ableton Push") > -1) {
            let push = new PushControl(input, output, actions);
            midiDevices.push(push);
            input.onmidimessage = push.onMIDIMessage;
            return;
        }else if (input.name.indexOf("Launchpad") > -1) {
            let launchPad = new LaunchPadControl(input, output, actions);
            midiDevices.push(launchPad);
            input.onmidimessage = launchPad.onMIDIMessage;
            return;
        }
    }
}

export default class Midi{
    constructor(){
        this.can_send = false;
        this.engine = new Engine();
        let that = this;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(function(midiAccess){
                that.can_send = true;
                midi = midiAccess;
                midi.onstatechange = that.onStateChange;
                initDevices();

            }, function(e){
                    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
            });
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    play(notes){
        if(this.can_send){
            let that = this;
            let note = 0;
            let timeBetweenNotes = 5000;
            let isRunning = false;
            let index = 0;
            let starting_time = new Date().getTime();
            console.log("Testing");
            while(index < 5){
                if(new Date().getTime() - starting_time >= 500){
                    console.log(index);
                    starting_time = new Date().getTime();
                    index++;
                }
            }
        }else{
            //this.engine.play(notes);
        }
    }

    onStateChange(event) {
        console.log('onStateChange');
        let port = event.port,
            state = port.state,
            name = port.name,
            type = port.type;

        if (type == "input") {
            console.log("name", name, "port", port, "state", state);
            let existingDevice = midiDevices.find(device => device.midiIn.id === port.id);
            if (!existingDevice || existingDevice.midiIn.state !== state) initDevices();
        }

        if (type == "output") {
            console.log("name", name, "port", port, "state", state);
        }
    }
}
