export default class MidiEngine{
    constructor(){

    }

    play(notes){
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(function(midiAccess){
                onMIDISuccess(midiAccess,notes);
            }, onMIDIFailure);
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    onMIDISuccess(notes){
        midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
        var inputs = midi.inputs.values();
        // loop over all available inputs and listen for any MIDI input
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            // each time there is a midi message call the onMIDIMessage function
            input.value.onmidimessage = onMIDIMessage;
        }
    }
}
