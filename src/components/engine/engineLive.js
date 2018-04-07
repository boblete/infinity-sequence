import React from 'react';
import Tone from 'tone';
import Recorder from 'recorderjs';
import { createDownloadLink } from '../../utils/downloadWAV';
import { PPQ } from '../../variables';

class EngineLive extends React.Component {

    constructor() {
        super();
        console.log("Make live engine")
    }

    _init() {
        this.initPlayers();
        this.initSequence(Tone.Transport)
        this.startUserMedia();
        this.ready = true;
    }

    _start() {
        Tone.Transport.start("+0.1");
    }

    _stop() {
        Tone.Transport.stop();
    }

    _export() {
        if (window.isRecording) return this.stopRecording()

        Tone.Transport.stop();
        Tone.Transport.scheduleOnce(() => this.stopRecording(), '1m');
        Tone.Transport.scheduleOnce(() => this.startRecording(), '0m');
        Tone.Transport.start('+4n');
        window.isRecording = true;
    }

    startUserMedia() {
        this.recorder = new Recorder(Tone.Master, { workerPath: 'assets/recorder.js' });
    }

    startRecording() {
        this.recorder && this.recorder.record();
    }

    stopRecording() {
        this.recorder && this.recorder.stop();
      	Tone.Transport.stop();
        this.recorder.exportWAV(createDownloadLink);
        this.recorder.clear();
        window.isRecording = false;
    }

    _updateSequence(notes) {
        for (let {id, channel, tick} of this.props.notes.values()) {
            if (!notes.has(id)) {
                let index = this.getSeqIndexFromTick(tick);
                this.sequences[channel].remove(index);
            }
        }

        for (let note of notes.values()) {
            if (this.props.notes.get(note.id) !== note) {
                let index = this.getSeqIndexFromTick(note.tick);
                this.sequences[note.channel].remove(index);
                this.sequences[note.channel].add(index, note);
            }
        }
    }

    render() {
        return <div />;
    }
}

export default EngineLive;
