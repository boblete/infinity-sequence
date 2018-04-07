import LaunchPadControl from './launchPad';
import PushControl from './push';

export default function initMidiDevices(actions) {
    let midi = null;
    let midiDevices = [];

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        console.warn('No MIDI support in your browser.');
    }

    function onMIDIFailure(e) {
        console.log('No access to MIDI devices or your browser doesn\'t support WebMIDI API. Please use WebMIDIAPIShim ' + e);
    }

    function onMIDISuccess(midiAccess) {
        midi = midiAccess;
        midi.onstatechange = onStateChange;
        initDevices();
    }

    function onStateChange(event) {
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

    function initDevices() {
        midiDevices = [];
        let inputs = midi.inputs.values();
        let outputs = midi.outputs.values();

        for (let input of inputs) {
            logInput(input);

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

    function logInput(input) {
        console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
            "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
            "' version: '" + input.version + "']");
    }

}
