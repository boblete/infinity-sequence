import Tone from 'tone';


export default class Engine{
    constructor(){
        this.synth = new Tone.Synth();
        this.synth.toMaster();
        this.seq;

        this.synth2 = new Tone.Synth();
        this.synth2.toMaster();
        this.seq2;
    }

    play(notes,durationValue,durationValue2){
        let that = this;
        this.seq = new Tone.Sequence(function(time, note){
            //console.log(note)
            that.synth.triggerAttackRelease(note, durationValue);
        //straight quater notes
    },notes, durationValue);
        this.seq.loop = 0;
        this.seq.start(0);
          this.seq2 = new Tone.Sequence(function(time, note){
            //console.log(note)
            that.synth2.triggerAttackRelease(note, durationValue);
        //straight quater notes
    },notes, durationValue2);
        this.seq2.loop = 0;
        this.seq2.start(0);
        Tone.Transport.start();
    }
    stop(){
        if(typeof this.seq !== 'undefined'){
            this.seq.stop();
            this.seq2.stop();
            Tone.Transport.stop();

        }
    }
}
