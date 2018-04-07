import MidiControl from './midiControl';

let gridButtons = [
    92, 93, 94, 95, 96, 97, 98, 99,
    84, 85, 86, 87, 88, 89, 90, 91,
    76, 77, 78, 79, 80, 81, 82, 83,
    68, 69, 70, 71, 72, 73, 74, 75,
    60, 61, 62, 63, 64, 65, 66, 67,
    52, 53, 54, 55, 56, 57, 58, 59,
    44, 45, 46, 47, 48, 49, 50, 51,
    36, 37, 38, 39, 40, 41, 42, 43
];

export default class PushControl extends MidiControl {
    constructor(input, output, actions) {
        super(input, output, actions, gridButtons, true);

        console.log("we have Push");

        this.velocitySensitive = true;
        this.channelButtons = [20, 21, 22, 23, 24, 25, 26, 27, 102, 103];
    }

    routeMessage(cmd, channel, type, note, velocity) {
    
    }

    updateChannelButtons(channel) {
       
    }
}