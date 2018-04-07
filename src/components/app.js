import React from 'react';
import Stave from './score/stave';
import Dropdown from 'react-dropdown';
import {convertMidiToNote,convertNoteToMidi} from '../utils/helpers';
import Engine from './engine/engine';
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
        octaves:OCTAVES,
        defaultOctaves:OCTAVES[3],
        totalNotes:100,
        startNote:0,
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
        this.getSeries();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        this.engine.play(this.state.noteContainer);
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
        var startNote=convertNoteToMidi(this.state.currentOption + OCTAVES[3]);
        this.setState({startNote, startNote});
        //console.log(this.state.startNote);
        var noteContainer = [];
        for(var j = 0 ; j<=endSeries;j++  ){
            noteContainer.push(convertMidiToNote(startNote - pn[j]));
        }
        //console.log(noteContainer);
        this.setState({noteContainer , noteContainer});
        this.renderSeries();
    }
    renderSeries() {
        let s = ""
        let noteContainer = this.state.noteContainer;
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

    render(){
        let { staveVisible,options ,defaultOption} = this.state;
        let { actions, visibleInstrument, volume, inputMode, registerOfflineHook, registerOnlineHook } = this.props;
        let _onSelect = this._onSelect
        return (
            <div className='is-container'>
            <h1>Infinity series</h1>
            <div className='span1'>
            <Dropdown options={options} onChange={(e) =>this._onSelect(e)} value={defaultOption} placeholder="Select an option" />
            </div>
             <div className='series'>
            { this.renderSeries()
            }
            </div>

            { staveVisible && (
                    <Stave
                        {...this.props}
                        {...this.state}
                    />
                ) }
            </div>
        )
    }
}

export default App;
