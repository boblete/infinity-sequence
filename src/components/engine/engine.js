import Tone from 'tone';


export default class Engine{
    constructor(){
        this.synth = new Tone.Synth({
                            oscillator : {
                            type : 'fmsquare',
                            modulationType : 'sawtooth',
                            modulationIndex : 3,
                            harmonicity: 3.4
                          },
                          envelope : {
                            attack : 0.001,
                            decay : 0.1,
                            sustain: 0.1,
                            release: 1
                          }
                      });
        this.synth.toMaster();
        this.seq;

        this.synth2 = new Tone.Synth({
                            oscillator : {
                            type : 'triangle8'
                          },
                          envelope : {
                            attack : 2,
                            decay : 1,
                            sustain: 0.4,
                            release: 4
                        }
                    });
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
