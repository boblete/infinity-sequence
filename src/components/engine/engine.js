import Tone from 'tone';


export default class Engine{
    constructor(){
        this.synth = new Tone.Synth();
        this.synth.toMaster();
        this.seq;
    }

    play(notes){
        let that = this;
        console.log("Notes");
        console.log(notes);
        this.seq = new Tone.Sequence(function(time, note){
            console.log(note)
            that.synth.triggerAttackRelease(note, "4n");
        //straight quater notes
    },notes, "4n");
        this.seq.loop = 0;
        this.seq.start(0);
        Tone.Transport.start();

    }

    stop(){
        if(typeof this.seq !== 'undefined'){
            this.seq.stop();
            Tone.Transport.stop();
        }
    }
}
