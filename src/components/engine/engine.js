import React from 'react';

let Tone;

export default class Engine extends React.Component {

    events = {};

    componentDidMount() {
        Tone = window.Tone;

    }

    
    componentWillReceiveProps({ notes }) {
        if (notes !== this.props.notes) {
            this.updateNotes(notes)
        }
    }

    updateNotes(notes) {
        for (let id of this.props.notes.keys()) {
            if (!notes.has(id)) {
                Tone.Transport.clear(this.events[id]);
                delete this.events[id];
            }
        }

        for (let { tick, key, duration, id } of notes.values()) {
            if (Object.prototype.hasOwnProperty.call(this.events, id)) continue;

            this.events[id] = Tone.Transport.schedule(time => {
                this.props.synth.triggerNoteOnOff(key, time, duration);
            }, `${tick}i`);
        }
    }

    render() {
        return null;
    }
}
