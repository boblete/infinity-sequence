import LaunchPadControl from './launchPad';
import PushControl from './push';
import Virtual from './virtual';

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
        console.log(input.name);

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
        }else if (input.name.indexOf("Virtual port") > -1) {
            let controller = new Virtual(input, output, actions,[]);
            midiDevices.push(controller);
            input.onmidimessage = controller.onMIDIMessage;
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
                midi = midiAccess;
                midi.onstatechange = that.onStateChange;
                initDevices();
                if(midiDevices.length > 0){
                    that.can_send = true;
                }

            }, function(e){
                    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
            });
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    play(notes,durationValue,durationValue2){
        if(this.can_send){
            this.playChannel(0,notes,durationValue);
            //this.playChannel(1,notes,durationValue2);
            if((midiDevices[0] instanceof LaunchPadControl)){
                this.engine.play(notes,durationValue,durationValue2);
            }
        }else{
            this.engine.play(notes,durationValue,durationValue2);
        }
    }

    playChannel(channel,notes,durationValue){
        let that = this;
        that.donePlaying = false;
        let durationInt = durationValue.replace( 'n', '');

        let timeBetweenNotes = parseInt(2000/durationInt);
        let starting_time = new Date().getTime();
        let index = 0;
        let note = helpers.convertNoteToMidi(notes[index]);
        midiDevices[0].sendMsgToOutput(channel,note,timeBetweenNotes,true);
        this.myInterval = setInterval(function(){
            midiDevices[0].sendMsgToOutput(channel,note,timeBetweenNotes,false);
            index++;
            if(index < notes.length){
                note = helpers.convertNoteToMidi(notes[index]);
                midiDevices[0].sendMsgToOutput(channel,note,timeBetweenNotes,true);
                console.log("Notes");
                console.log(notes.length);
                console.log(index);
            }

            if(index >= notes.length){
                that.donePlaying = true;
                console.log(index);
            }
            if(that.donePlaying){
                midiDevices[0].clearButtons();
                clearInterval(that.myInterval);
            }
        },timeBetweenNotes);
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
