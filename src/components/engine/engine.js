import Tone from 'tone';


export default class Engine{
    constructor(){
        this.synth = new Tone.Synth();
        this.synth.toMaster();
    }

    play(notes){
        let that = this;
        var seq = new Tone.Sequence(function(time, note){
            that.synth.triggerAttackRelease(note, "4n");
        //straight quater notes
    },notes, "4n");
        seq.loop = 0;
        seq.start(0);
        Tone.Transport.start();

    }
}
