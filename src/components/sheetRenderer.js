import React from 'react';
import Vex from 'vexflow';
// import { convertMidiToNote } from './utils/helpers';

const { Renderer, Stave, StaveNote, StaveTie, Voice, Formatter, Beam, Accidental } = Vex.Flow;

class SheetMusic extends React.Component {
    constructor(props) {
        super(props);
    }

    initNotesAsVexflowObject(notes) {
        let vexFlowNotes = [];
        let clef = this.props.octave > 3 ? "treble" : "bass"; 

        notes.forEach((elem, index) => {
            let length = elem.length;
            let formattedNote = elem.substring(0, length-1) + "/" + elem.substring(length - 1);
            
            vexFlowNotes.push(new StaveNote({
                clef: clef,
                keys: [formattedNote],
                duration: "w",
            }));
        });

        return vexFlowNotes;
    }

    createStave(renderer, vexFlowNotes) {
        const ctx = renderer.getContext();
        const stave = new Stave(0, 0, 1200);  // x, y, width
        const clef = this.props.octave > 3 ? "treble" : "bass"; 
        stave.addClef(clef).setContext(ctx).draw();
        return Formatter.FormatAndDraw(ctx, stave, vexFlowNotes);
    }

    chunkArray(arr, len) {
        let chunked = [];
        len = parseInt(len);
        for (let i = 0; i < arr.length; i += len) {
            chunked.push(arr.slice(i, i + len));
        }
      
        return chunked;
    }
      

    renderVexFlow(notes) {
        const chord = this.initNotesAsVexflowObject(notes); 

        const svgContainer = document.createElement('div');
        const renderer = new Renderer(svgContainer, Renderer.Backends.SVG);
        const renderedStaves = this.createStave(renderer, chord);
        
        const svg = svgContainer.childNodes[0];
        const padding = 10;
        const half = padding / 2;
        svg.style.height = Math.max(1200, renderedStaves.h);
        svg.style.left = "0px";
        svg.style.width = 1200 + "px";
        svg.style.position = "absolute";
        svg.style.overflow = "visible";
        svgContainer.style.height = Math.max(100, renderedStaves.h + padding) + "px";
        svgContainer.style.width = 1200 + "px";
        svgContainer.style.position = "relative";
        svgContainer.style.display = "inlineBlock";

        this.refs.outer.appendChild(svgContainer);
    }
    
    clearOuterRef() {
        this.refs.outer.innerHTML = "";
    }

    renderStaves() {
        let chunkedNotes = this.chunkArray(this.props.notes, this.props.staveLength);
        // console.log("cn",chunkedNotes);
        chunkedNotes.forEach((elem, index) => {
            this.renderVexFlow(elem);
        });
    }

    componentDidUpdate() {
        if (this.props.notes.length > 0) {
            this.clearOuterRef()
            this.renderStaves();
        }
    }

    render() {
        return (
            <div ref="outer" style={{
                padding:'30px',
                backgroundColor: 'white',
                display: "inline-block",
            }}>
                
            </div>
        );
    }
}

export default SheetMusic;
