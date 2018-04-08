import MidiControl from './midiControl';

let gridButtons = [

];

export default class Virtual extends MidiControl {
    constructor(input, output, actions) {
        super(input, output, actions, gridButtons);
        this.velocitySensitive = false;

        console.log("we have a virtual port");
    }

    routeMessage(cmd, channel, type, note, velocity) {
        if (note === 105) {
            if (this.currentChannel === 9) return;
            return this.changeChannel(this.currentChannel + 1);
        }
        if (note === 104) {
            if (this.currentChannel === 0) return;
            return this.changeChannel(this.currentChannel - 1);
        }
    }
    



}
