import React from 'react';
import Stave from './score/stave'
import Dropdown from 'react-dropdown'
import SheetMusic from './sheetRenderer';
import {convertMidiToNote,convertNoteToMidi} from '../utils/helpers'
import Engine from './engine/engine'
/*
The Danish composer Per Nørgård's "infinity sequence",
invented in an attempt to unify in a perfect way repetition and variation:
a(2n) = -a(n), a(2n+1) = a(n) + 1, a(0)=0.
*/



const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [1,2,3,4,5,6,7,8];
class App extends React.Component {
     constructor(props) {
        super();
        this.engine = new Engine();
     }
    state = {
        staveVisible: false,
        options:NOTES,
        defaultOption:NOTES[0],
        octaveOptions:OCTAVES,
        currentOctaveOption:OCTAVES[3],
        intervalOptions:OCTAVES,
        currentIntervalOption:OCTAVES[0],
        octaves:OCTAVES,
        defaultOctaves:OCTAVES[3],
        totalNotes:100,
        startNote:0,
        currentNote:60,
        currentOption:'C',
        noteContainer:[]
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
        this.engine.stop();
        this.engine.play(this.state.noteContainer)
    }

    componentWillUpdate(nextProps,nextState){
        console.log(nextState,this.state);
        if(nextState.currentOption!==this.state.currentOption){
            console.log('nextState',nextState.currentOption,this.state.currentOption);
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
    }
    getSeries(){
        var pn = [0,1]
        var endSeries = this.state.startNote+ this.state.totalNotes;
        for(var i = 1; i<=endSeries;i++){
            pn[2*i] = pn[2*i -2] - (pn[i] - pn[i-1])
            pn[2*i +1] = pn[2*i -1] + (pn[i] - pn[i-1])
        }
        /*
            pn[2*i] = pn[2*i -2] - (pn[i] - pn[i-1])
            pn[2*i +1] = pn[2*i -1] + (pn[i] - pn[i-1])
        */
        console.log(this.state.currentOption , OCTAVES[3])
        var currentNote=convertNoteToMidi(this.state.currentOption + this.state.currentOctaveOption);
        this.setState({currentNote, currentNote});
        console.log(this.state.startNote);
        var noteContainer = [];
        for(var j = this.state.startNote ; j<=endSeries;j++  ){
            noteContainer.push(convertMidiToNote(currentNote - pn[j]));
        }
        console.log(noteContainer);
        this.setState({noteContainer , noteContainer});
      //  this.renderSeries();
    }

    renderSeries() {
        let s = ""
        let noteContainer = this.state.noteContainer;
        console.log(this.state.noteContainer);
        for(var k = 0 ; k <noteContainer.length; k++){
            s += noteContainer[k]+ ", ";
        }
        return s;
    }
    _onSelect(e){
        console.log(e,this);
        let currentOption = e.value;
        this.setState({currentOption , currentOption}, this.getSeries());
    }
     _onSelectOctave(e){
        console.log(e,this);
        let currentOctaveOption = e.value;
        this.setState({currentOctaveOption , currentOctaveOption}, this.getSeries());
    }
     _onSelectInterval(e){
        console.log(e,this);
        let currentIntervalOption = e.value;
        this.setState({currentIntervalOption , currentIntervalOption}, this.getSeries());
    }

    render() {
        let { staveVisible,options ,defaultOption,currentOption,octaveOptions,currentOctaveOption,intervalOptions,currentIntervalOption} = this.state;
        let { actions, visibleInstrument, volume, inputMode, registerOfflineHook, registerOnlineHook } = this.props;
        let _onSelect = this._onSelect

        console.log('render');
        return (
            <div className='is-container'>
            <h1>Infinity series</h1>
            <div className='span1'>
            <p>key:</p>
            <Dropdown options={options} onChange={(e) =>this._onSelect(e)} value={currentOption} placeholder="Select an option" />
            <p>octave:</p>
            <Dropdown options={octaveOptions} onChange={(e) =>this._onSelectOctave(e)} value={""+currentOctaveOption} placeholder="Select an option" />
            <p>interval:</p>
            <Dropdown options={intervalOptions} onChange={(e) =>this._onSelectInterval(e)} value={""+currentIntervalOption} placeholder="Select an option" />

            <p>start:</p>
            <p>length:</p>
            </div>
             <div className='series'>
            { this.renderSeries()
            }
            </div>
            { /* <div className="vexFlow">
                    <SheetMusic notes={this.state.noteContainer}/>
                </div>


                {/* { staveVisible && (
                        <Stave

                            {...this.props}
                            {...this.state}
                        />
                    ) }
                <Engine
                    {...this.props}
                    {...this.state}
                /> */}

            </div>
        )
    }
}

export default App;
