import React from 'react';
import renderScore from './renderScore';
import svgToPng from './svgToPng.js';

class Stave extends React.Component {

    state = {};
    
    componentDidMount() {
        if (this.props.notes) this.notesAndRests = renderScore(this.domRef, this.props.notes, this.props.bars);
    }

    shouldComponentUpdate({ notes }) {
        if (notes !== this.props.notes) return true;

        return false;
    }

    componentWillReceiveProps({ selectedNoteIds }) {
        if (selectedNoteIds.length) this.highlightSelectedNotes(selectedNoteIds);
    }

    componentDidUpdate() {
        if (this.props.notes) this.notesAndRests = renderScore(this.domRef, this.props.notes, this.props.bars);

        if (this.props.selectedNoteIds.length) this.highlightSelectedNotes(this.props.selectedNoteIds);
    }

    highlightSelectedNotes(selectedNoteIds) {
        const stave = this.domRef.firstChild;
        if (!stave) return;
        const noteAndRestNodes = Array.from(stave.childNodes).filter(node => node.nodeName === 'g');
        const index = this.notesAndRests.findIndex(({ id }) => id === this.props.selectedNoteIds[0]);
        noteAndRestNodes.forEach((elem, i) => {
            const fill = i === index ? '#0000FF' : '#000000';
            elem.querySelector('path').setAttribute('fill', fill);
        })
        if (index === -1) return;
        
    }

    handleMouseDown = (e) => {
        if (e.target.parentNode.className.baseVal === 'vf-notehead') {
            const selectedNoteNode = e.target.parentNode.parentNode.parentNode;
            const stave = this.domRef.firstChild;
            const noteAndRestNodes = Array.from(stave.childNodes).filter(node => node.nodeName === 'g');
            const index = noteAndRestNodes.indexOf(selectedNoteNode);

            this.props.setSelectedNoteIds(this.notesAndRests[index].id)

            this.setState({ dragStart: e.pageX - this.domRef.getBoundingClientRect().left });
        }
    }

    handleMouseMove = (e) => {
        const { notes, selectedNoteIds, updateNotes } = this.props;
        const { dragStart } = this.state;

        if (!dragStart) return;

        const { top, left } = this.domRef.getBoundingClientRect();
        const x = e.pageX - left;
        const y = e.pageY - top;

        if (y < 10) return;
        
        const topLimit = 94, lineHeight = 5, centreOffset = 3;
        const key = topLimit - Math.floor((y - centreOffset) / lineHeight);
        const note = this.props.notes.get(selectedNoteIds[0]);
        
        let tick;

        if (note.key !== key) {
            tick = note.tick;
            
        } else if (x < (dragStart - 20)) {
            tick = note.tick - 48
            
        } else if (x > (dragStart + 20)) {
            tick = note.tick + 48
        }

        if (tick === undefined) return;

        this.props.updateNotes({ ...note, key, tick });

        this.setState({ dragStart: x });
    }

    handleMouseUp = () => {
        if (this.state.dragStart) this.setState({ dragStart: null });
    }

    render() {

        return (
            <div>
                { false && this.props.notes.size > 0 && (
                    <button onClick={() => svgToPng.saveSvgAsPng(this.domRef.firstChild, 'score.png')}>Download</button>
                ) }
                <div 
                    className='stave' 
                    ref={ref => this.domRef = ref} 
                    onMouseMove={this.handleMouseMove} 
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                />
                
            </div>
            
        )
    }
}

export default Stave;