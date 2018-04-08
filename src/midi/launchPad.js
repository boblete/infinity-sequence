import MidiControl from './midiControl';

let gridButtons = [
    0, 1, 2, 3, 4, 5, 6, 7,
    16, 17, 18, 19, 20, 21, 22, 23,
    32, 33, 34, 35, 36, 37, 38, 39,
    48, 49, 50, 51, 52, 53, 54, 55,
    64, 65, 66, 67, 68, 69, 70, 71,
    80, 81, 82, 83, 84, 85, 86, 87,
    96, 97, 98, 99, 100, 101, 102, 103,
    112, 113, 114, 115, 116, 117, 118, 119
];

export default class LaunchPadControl extends MidiControl {
    constructor(input, output, actions) {
        super(input, output, actions, gridButtons);
        this.velocitySensitive = false;

        console.log("we have Launchpad");
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
    sendMsgToOutput(channel,note,time,on){
        let btn = gridButtons[note%gridButtons.length];
        let msg =  new Uint8Array( [144+channel, btn, 1 ]);
        if(on){
            this.midiOut.send(msg);
        }else{
            msg =  new Uint8Array( [128+channel, btn, 0 ]);
            let timeSend = window.performance.now() + time;
            this.midiOut.send(msg);
        }
    }



}
