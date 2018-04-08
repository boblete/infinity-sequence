import React from 'react';
import Stave from './score/stave';
import Dropdown from 'react-dropdown';
import SheetMusic from './sheetRenderer';
import {convertMidiToNote,convertNoteToMidi} from '../utils/helpers';
import Engine from './engine/engine';
import Midi from '../midi/midi';

import Stepper from 'react-stepper-primitive';
/*
The Danish composer Per Nørgård's "infinity sequence",
invented in an attempt to unify in a perfect way repetition and variation:
a(2n) = -a(n), a(2n+1) = a(n) + 1, a(0)=0.
*/



const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [1,2,3,4,5,6,7,8];
const INTERVAL = [-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12];

class App extends React.Component {
     constructor(props) {
        super();
        this.midi = new Midi();
        this.midiUpdated = false;
        this.skippedFirstUpdate = false;
        this.midisActive = [false,false,false,false,false,false,false,false,false,false];
        //this.engine = new Engine();
     }

    state = {
        staveVisible: false,
        options:NOTES,
        defaultOption:NOTES[0],
        octaveOptions:OCTAVES,
        currentOctaveOption:OCTAVES[3],
        intervalOptions:INTERVAL,
        currentIntervalOption:1,
        octaves:OCTAVES,
        defaultOctaves:OCTAVES[3],
        totalNotes:24,
        startNote:0,
        currentNote:60,
        currentOption:'C',
        noteContainer:[],
        durationValue:"4n",
        durationValue2:"1n",
        durationValue3:"4n",
        staveLength:25
    }

    /*
    import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
const defaultOption = options[0]
<Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
    */


    componentDidMount () {
        this.getSeries()
    }


    componentDidUpdate(){
        /*
        if(this.skippedFirstUpdate){
            if(!this.midiUpdated){
                this.midi.play(this.state.noteContainer,this.state.durationValue,this.state.durationValue);
                this.midiUpdated = true;
            }else{
                this.midiUpdated = false;
            }
        }else{
            this.skippedFirstUpdate= true;
        }*/

    }

    componentWillUpdate(nextProps,nextState){
        // console.log(nextState,this.state);
        if(nextState.currentOption!==this.state.currentOption){
            // console.log('nextState',nextState.currentOption,this.state.currentOption);
            //this.setState()
            this.state.currentOption=nextState.currentOption
            this.getSeries();
            //this.renderSeries();
        }
        if(nextState.currentOctaveOption!==this.state.currentOctaveOption){
            this.state.currentOctaveOption=nextState.currentOctaveOption;
            this.getSeries();
        }
         if(nextState.currentIntervalOption!==this.state.currentIntervalOption){
            this.state.currentIntervalOption=nextState.currentIntervalOption;
            this.getSeries();
        }
        if(nextState.totalNotes!==this.state.totalNotes){
            this.state.totalNotes=nextState.totalNotes;
            this.getSeries();
        }
          if(nextState.startNote!==this.state.startNote){
            this.state.startNote=nextState.startNote;
            this.getSeries();
        }
    }
    getSeries(){

        var pn = [0,this.state.currentIntervalOption]
        var endSeries = this.state.startNote+ this.state.totalNotes;
        for(var i = 1; i<=endSeries;i++){
            pn[2*i] = pn[2*i -2] - (pn[i] - pn[i-1]);
            pn[2*i +1] = pn[2*i -1] + (pn[i] - pn[i-1]);
        }
        /*
            pn[2*i] = pn[2*i -2] - (pn[i] - pn[i-1])
            pn[2*i +1] = pn[2*i -1] + (pn[i] - pn[i-1])
        */
        // console.log(pn)
        // console.log(this.state.currentOption , OCTAVES[3])
        var currentNote=convertNoteToMidi(this.state.currentOption + this.state.currentOctaveOption);
        this.setState({currentNote, currentNote});
        // console.log(pn);
        var noteContainer = [];
        for(var j = this.state.startNote ; j<endSeries;j++  ){
            //this will error if the end note is a negative midi number - if midi is a negative then it breaks - 
            //need to maybe set the midi note to a real midi value without breakind the series 
            let midiValue = currentNote - pn[j]
            while(midiValue<0){
                console.log(midiValue)
                midiValue+=12
            }

            noteContainer.push(convertMidiToNote(midiValue));
        }
        console.log(noteContainer);
        this.setState({noteContainer , noteContainer});
      //  this.renderSeries();
    }

    renderSeries() {
        let s = ""
        let noteContainer = this.state.noteContainer;
        // console.log(this.state.noteContainer);
        for(var k = 0 ; k <noteContainer.length; k++){
            s += noteContainer[k]+ ", ";
        }
        return s;
    }
    _onSelect(e){
        // console.log(e,this);
        let currentOption = e.value;
        this.setState({currentOption , currentOption});
    }
     _onSelectOctave(e){
        // console.log(e,this);
        let currentOctaveOption = e.value;
        this.setState({currentOctaveOption , currentOctaveOption});
    }
     _onSelectInterval(e){
        // console.log(e,this);
        let currentIntervalOption = e.value;
        this.setState({currentIntervalOption , currentIntervalOption});
    }
    _onSelectStart(e){
        // console.log(e)
         let startNote = e
        this.setState({startNote , startNote});
    }
     _onSelectLength(e){
        // console.log(e)
        let totalNotes = e
        this.setState({totalNotes , totalNotes});
    }
     _onSelectStaveLength(e){
        // console.log(e)
        let staveLength = e
        this.setState({staveLength , staveLength});
    }
    _handleChange(e){

     this.setState({durationValue: e.target.value});
    }
     _handleChange2(e){

     this.setState({durationValue2: e.target.value});
    }
     _handleChange3(e){

     this.setState({durationValue3: e.target.value});
    }
    _handleMidi(e){
        this.midisActive[e] = !this.midisActive[e];
        if(this.midisActive[e]){
            this.midi.play(e,this.state.noteContainer,this.state.durationValue3);
        }else{
            this.midi.stopPlaying(e);
        }
    }
    render() {
        let { noteContainer,staveVisible,options ,defaultOption,totalNotes,startNote,currentOption,staveLength,octaveOptions,currentOctaveOption,intervalOptions,currentIntervalOption} = this.state;
        let { actions, visibleInstrument, volume, inputMode, registerOfflineHook, registerOnlineHook } = this.props;
        //let _onSelect = this._onSelect
        // console.log('render');
        return (
            <div className='is-container'>
                <h1>Infinity series</h1>
                <div className='span1'>
                <p>The Danish composer Per Nørgård's "infinity sequence",
invented in an attempt to unify in a perfect way repetition and variation:
a(2n) = -a(n), a(2n+1) = a(n) + 1, a(0)=0. <a href='https://www.youtube.com/watch?v=psUmxWZUP0c'>Link</a></p>
                    <div className='control-box' >
                    <p>First Note Pitch:</p>
                    <Dropdown options={options} onChange={(e) =>this._onSelect(e)} value={currentOption} placeholder="Select an option" />
                    </div>

                    <div className='control-box' >
                    <p>Octave:</p>
                    <Dropdown options={octaveOptions} onChange={(e) =>this._onSelectOctave(e)} value={""+currentOctaveOption} placeholder="Select an option" />
                     </div>

                     <div className='control-box' >
                    <p>Interval seed (between 1st and 2nd note):</p>
                    <Dropdown options={intervalOptions} onChange={(e) =>this._onSelectInterval(e)} value={""+currentIntervalOption} placeholder="Select an option" />
                    </div>

                    <div className='control-box' >
                    <p>Series start offset:</p>
                    <Stepper
                        min={0}
                        max={100} value = {startNote} onChange={(e)=> this._onSelectStart(e)} render={({
                          getFormProps,
                          getInputProps,
                          getIncrementProps,
                          getDecrementProps
                     }) =>
                          <form {...getFormProps()}>
                            <button className='my-button' {...getDecrementProps()}>
                             -
                            </button>
                            <input className='my-step-input' {...getInputProps()} />
                            <button className='my-button' {...getIncrementProps()}>
                              +
                            </button>
                          </form>}/>
                     </div>
                    <div className='control-box' >
                     <p>Length of series to display:</p>
                     <Stepper
                            min={1}
                            max={200} value={totalNotes} onChange={(e)=> this._onSelectLength(e)}  render={({
                              getFormProps,
                              getInputProps,
                              getIncrementProps,
                              getDecrementProps
                         }) =>
                              <form {...getFormProps()}>
                                <button className='my-button' {...getDecrementProps()}>
                                 -
                                </button>
                                <input className='my-step-input' {...getInputProps()} />
                                <button className='my-button' {...getIncrementProps()}>
                                  +
                                </button>
                              </form>}/>

                     </div>
                       <div className='control-box' >
                     <p>notes per stave:</p>
                     <Stepper
                            min={10}
                            max={200} value={staveLength} onChange={(e)=> this._onSelectStaveLength(e)}  render={({
                              getFormProps,
                              getInputProps,
                              getIncrementProps,
                              getDecrementProps
                            }) =>
                              <form {...getFormProps()}>
                                <button className='my-button' {...getDecrementProps()}>
                                 -
                                </button>
                                <input className='my-step-input' {...getInputProps()} />
                                <button className='my-button' {...getIncrementProps()}>
                                  +
                                </button>
                              </form>}/>

                     </div>
                     <div>
                        <div className='control-box-inst' >
                         <p>note duration instrument 1:</p>
                         <textarea value={this.state.durationValue} onChange={(e)=>this._handleChange(e)} />
                         </div>
                          <div className='control-box-inst' >
                         <p>note duration instrument2:</p>
                         <textarea value={this.state.durationValue2} onChange={(e)=>this._handleChange2(e)} />
                         </div>
                          <div className='control-box-midi' >
                         <p>note duration midi:</p>
                         <textarea className='miditext' value={this.state.durationValue3} onChange={(e)=>this._handleChange3(e)} />
                        <button onClick={(e)=>this._handleMidi(0) }>Start Midi 1</button>
                        <button onClick={(e)=>this._handleMidi(1) }>Start Midi 2</button>
                        <button onClick={(e)=>this._handleMidi(2) }>Start Midi 3</button>
                        <button onClick={(e)=>this._handleMidi(3) }>Start Midi 4</button>
                        <button onClick={(e)=>this._handleMidi(4) }>Start Midi 5</button>
                         </div>
                     </div>
                </div>
                <div>
                    <p>Series:</p>
                    <div className='series'>
                    <p>
                       { this.renderSeries() }</p>
                    </div>
                    <div className="vexFlow">
                        <SheetMusic notes={noteContainer} staveLength={staveLength} octave={currentOctaveOption}/>
                    </div>

                </div>
            </div>
        )
    }
}

export default App;
