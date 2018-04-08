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
        this.donePlaying = false;
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
            that.donePlaying = false;
            let timeBetweenNotes = 2000;
            let index = 1;
            let starting_time = new Date().getTime();
            let note = helpers.convertNoteToMidi(notes[index]);
            midiDevices[0].sendMsgToOutput(note,timeBetweenNotes,true);
            this.myInterval = setInterval(function(){
                midiDevices[0].sendMsgToOutput(note,timeBetweenNotes,false);
                index++;
                note = helpers.convertNoteToMidi(notes[index]);
                console.log(index);
                midiDevices[0].sendMsgToOutput(note,timeBetweenNotes,true);
                if(index > 10){
                    that.donePlaying = true;
                }
                if(that.donePlaying){
                    midiDevices[0].sendMsgToOutput(note,timeBetweenNotes,false);
                    clearInterval(that.myInterval);
                }
            },timeBetweenNotes);
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

    stopPlaying(){
        console.log("Stop playing");
        this.engine.stop();
        clearInterval(this.myInterval);
        if(midiDevices[0] !== undefined){
            midiDevices[0].clearButtons();
        }

    }
}
