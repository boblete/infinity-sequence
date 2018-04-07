export function addTemporaryMouseMoveListener(handler, cb) {
    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', handler);
        if (cb) cb();
    }, {once: true});
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function convertNoteToMidi(note) {
    note = note.toUpperCase();
    let index = NOTES.indexOf(note.substr(0, note.length - 1));
    let octave = parseInt(note.substr(-1)) + 2;

    return octave * 12 + index;
}

export function convertMidiToNote(midi, separator = '') {
    let index = midi % 12;
    let octave = Math.floor(midi / 12) - 2;

    return NOTES[index] + separator + octave;
}

export function convertMidiToFreq(midi) {
    return midi === 0 || (midi > 0 && midi < 128) ? Math.pow(2, (midi - 69) / 12) * 440 : null;
}

const BPM = 120; // set dynamically

export function convertSecondsToBars(seconds) {
    return Math.floor((BPM / 60) * seconds / 4) + 1;
}

export function convertBarsToSeconds(bar) {
    return (bar - 1) * 4 * 60 / BPM;
}

export const generateId = note => `${note.key}_${note.tick}_${note.duration}`;

export function enableKeyboard(onKeyDown, onKeyUp) {
    const keys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];
    let oct = 3;
    let heldKey;

    window.addEventListener('keydown', e => {
        let offset = keys.indexOf(e.key);
        if (offset !== -1) {
            let note = oct * 12 + offset
            if (heldKey === note) return;
            heldKey = note;
            onKeyDown(note);
        } 
        if (e.key === 'z') oct--;
        if (e.key === 'x') oct++;
    })

    window.addEventListener('keyup', e => {
        let offset = keys.indexOf(e.key);
        if (offset !== -1) {
            let note = oct * 12 + offset
            onKeyUp(note);
        } 
        heldKey = null;
    })
}


