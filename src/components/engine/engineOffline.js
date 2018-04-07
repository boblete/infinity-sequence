import Tone from 'tone';
import { downloadWAV } from '../../utils/downloadWAV'

class EngineOffline {

    constructor() {
        console.log("Make offline engine")
    }

    _init() {
        this.bufferId = 0;
        this.ready = false;

        let player1 = new Tone.Player().toMaster()
        let player2 = new Tone.Player().toMaster()
        player1.loop = player2.loop = true
        player1.loopStart = player2.loopStart = "1:0:0"
        player1.loopEnd = player2.loopEnd = "2:0:0"
        this.players = [player1, player2]
        this.resetPlayers()
    }

    createOfflineBuffer() {
        return Tone.Offline(Transport => {
            this.initSequence(Transport);
            Transport.start();
        }, 60 / this.bpm * 8)
    }

    resetPlayers() {
        this.players[0].volume.value = 0
        this.players[1].volume.value = -Infinity
        this.loopOffset = 0
    }

    _start() {
        this.players[0].start(Tone.context.currentTime, this.cursor * this.getTickLength() + this.loopOffset);
    }

    pause() {
        this.updateCursor();
        this.players[0].stop();
    }

    _stop() {
        this.players.forEach(player => player.stop())
        this.resetPlayers()
    }

    _export() {
        downloadWAV(this.players[0].buffer)
    }

    updateBuffer() {
        let id = ++this.bufferId
        this.createOfflineBuffer()
        .then(buffer => {
            if (id !== this.bufferId) return

            console.log('buffer received')
            if (!this.ready) this.ready = true
            this.players.forEach(player => player.buffer = buffer)

            if (this.isPlaying) {
                this.loopOffset = 16 * this.getTickLength()
                this.pause()
                this.start()
                this.players[0].volume.linearRampToValueAtTime(0, Tone.context.currentTime + 0.05)
                this.players[1].volume.linearRampToValueAtTime(-Infinity, Tone.context.currentTime + 0.05)
                this.players.reverse()
            }
        })
    }

    _updateSequence(gridData) {
        // TODO: wait till the new note is about to play before we switch buffer
        // but this will involve scheduling buffer updates - is this worth the hassle?
        this.gridData = gridData
        this.updateBuffer()
    }

    _setSwing() {
        this.updateBuffer();
    }

    _setBPM() {
        this.updateBuffer();
    }

    _setSpriteSheet() {
        this.updateBuffer();
    }
}

export default EngineOffline;
