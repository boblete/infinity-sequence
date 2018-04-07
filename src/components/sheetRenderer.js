import Vex from 'vexflow';
import React from 'react';
// import { convertMidiToNote } from './utils/helpers';

const { Renderer, Stave, StaveNote, StaveTie, Voice, Formatter, Beam, Accidental } = Vex.Flow;

class SheetMusic extends React.Component {
    constructor(props) {
        super(props);
        this.vexFlowRef = React.createRef();
    }

    getNotes() {
        return this.props.notes;
    }

    componentDidMount() {
        const chord = [new StaveNote({
            keys: ["d/4", "f#/4"],
            duration: "w",
        })];        

        const svgContainer = document.createElement('div');
        const renderer = new Renderer(svgContainer, Renderer.Backends.SVG);
        const ctx = renderer.getContext();
        const stave = new Stave(0, 0, 100);  // x, y, width
        stave.addClef("treble").setContext(ctx).draw();
        const bb = Formatter.FormatAndDraw(ctx, stave, chord);

        const svg = svgContainer.childNodes[0];
        const padding = 10;
        const half = padding / 2;
        svg.style.top = -bb.y + half + Math.max(0, (100 - bb.h) * 2/3) + "px";
        svg.style.height = Math.max(100, bb.h);
        svg.style.left = "0px";
        svg.style.width = 100 + "px";
        svg.style.position = "absolute";
        svg.style.overflow = "visible";
        svgContainer.style.height = Math.max(100, bb.h + padding) + "px";
        svgContainer.style.width = 100 + "px";
        svgContainer.style.position = "relative";
        svgContainer.style.display = "inlineBlock";

        this.refs.outer.appendChild(svgContainer);
    }

    render() {
        return (<div ref="outer" style={{
            border: "2px blue solid",
            padding: 10,
            borderRadius: 10,
            display: "inline-block",
        }}>
        </div>);
    }
}

export default SheetMusic;
