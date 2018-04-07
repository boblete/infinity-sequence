import Vex from 'vexflow';
import { convertMidiToNote } from '../../utils/helpers'

const { Renderer, Stave, StaveNote, StaveTie, Voice, Formatter, Beam, Accidental } = Vex.Flow;

export default function renderScore(elem, midiNotes, bars) {

    elem.innerHTML = '';

    const renderer = new Renderer(elem, Renderer.Backends.SVG);
    
    renderer.resize(650, 220);

    const context = renderer.getContext();

    const { notes, ties } = Array.from(midiNotes.values())
        // sort into tick order
        .sort((a, b) => a.tick - b.tick)
        // calculate times in 64ths
        .map(note => Object.assign({}, note, {
            start: note.tick / 12, 
            duration: note.duration / 12, 
            keys: [convertMidiToNote(note.key, '/')],
            stem_direction: -1
        }))
        // split into quarters
        .reduce((a, note) => {
            let quarter = Math.floor(note.start / 16);
            let existingNoteIndex = a[quarter].findIndex(n => note.start === n.start);
            if (existingNoteIndex !== -1) {
                // add key to existing note if it exists
                a[quarter][existingNoteIndex].keys.push(...note.keys)
            } else {
                a[quarter].push(note);
            }
            return a;
        }, Array.from({ length: bars * 4 }, v => []))
        .map(quarter => {
            if (quarter.length === 0) return [{duration: 16, rest: true}];
            
            return quarter.reduce((a, note, n) => {
                // add rest before first note
                if (n === 0 && note.start % 16 > 0) {
                    a.push(...decomposeNote({duration: note.start % 16, rest: true}));
                }

                let nextNote = quarter[n + 1];

                if (!nextNote && a.length === 1 && a[0].start % 16 === 0 && note.start % 16 === 4) {
                    // if pattern is [X,X,-,-], we add a rest
                    a = [...a, Object.assign({}, note, {duration: 4}), {duration: 4, rest: true}]
                } else {
                    // else we set duration based on next note in sequence
                    let duration = (nextNote ? nextNote.start % 16 : 16) - (note.start % 16);
                    a.push(Object.assign({}, note, {duration}));
                }

                return a;
            }, [])
        })
        // replace consecutive quarter rests with 1 half rest
        .reduce((a, quarter, i) => {
            let prevQuarter = a[a.length - 1];
            if (
                i % 2 &&
                quarter[0].rest && quarter[0].duration === 16 &&
                prevQuarter[0].rest && prevQuarter[0].duration === 16
            ) {
                a[a.length - 1] = [{duration: 32, rest: true}]
            } else {
                a.push(quarter);
            }
            return a;
        }, [])
        // flatten array
        .reduce((a, quarter) => [...a, ...quarter])
        .reduce((a, note) => {
            if (note.rest) {
                a.notes.push(renderStaveNote(note));
            } else {
                // notes are decomposed here instead of above, so that we can keep track of ties
                let notes = decomposeNote(note);
                notes.forEach(note => {
                    a.notes.push(renderStaveNote(note));
                })
                if (notes.length > 1) {
                    // we have a tie...
                    let startIndex = a.notes.length - notes.length;
                    a.ties.push(new StaveTie({
                        first_note: a.notes[startIndex],
                        last_note: a.notes[startIndex + notes.length - 1],
                        first_indices: [0],
                        last_indices: [0]
                    }));
                }
            }
            
            return a;
        }, {notes: [], ties: []})
    
    let stave = new Stave(10, 0, 670);
    stave.addClef('treble').addTimeSignature("4/4");
    stave.setContext(context).draw();
    
    let beams = Beam.generateBeams(notes, {maintain_stem_directions: true});
    Formatter.FormatAndDraw(context, stave, notes);
    beams.forEach(beam => beam.setContext(context).draw());
    ties.forEach(tie => tie.setContext(context).draw());

    function decomposeNote(note) {
        let denominator = note.duration;

        while (64 % denominator !== 0) denominator--;

        if (denominator === note.duration) return [note]; // regular note

        let diff = note.duration - denominator;

        if (diff === note.duration / 3) return [Object.assign(note, { 
            duration: denominator,
            dotted: true
        })] // dotted note

        return [
            Object.assign(note, {duration: denominator}), 
            ...decomposeNote(Object.assign({}, note, {duration: diff}))
        ] // tied notes or split rests
    }

    function renderStaveNote(note) {
        let { dotted, keys = ['c/5'], stem_direction, rest } = note;
        let duration = `${64 / note.duration}`;
        if (rest) duration += 'r';
        let staveNote = new StaveNote({
            keys,
            duration,
            stem_direction
        });
        staveNote.id = note.id;
        keys.forEach((key, i) => {
            if (/#/.test(key)) staveNote.addAccidental(i, new Accidental("#"));
            else if (/b/.test(key)) staveNote.addAccidental(i, new Accidental("b"));
        })
        if (dotted) staveNote.addDotToAll();
        return staveNote;
    }

    return notes;
}