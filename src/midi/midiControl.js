class MidiControl {
    constructor(input, output, actions, gridButtons) {
		this.highlightStep = this.highlightStep.bind(this);
        this.onMIDIMessage = this.onMIDIMessage.bind(this);

        for (let action in actions) {
            this[action] = actions[action];
        }

        // input.onmidimessage = this.onMIDIMessage;
        this.midiIn = input;
        this.midiOut = output;
        this.gridButtons = gridButtons;
        this.buttonIntensity = [0, 1];
        this.buttonBlink = [0, 1, 2];
        this.launchButtonColor = [0, 1, 2, 3];
		this.currentChannel = 0;
		this.division = 32;
        this.velocitySensitive = false;

        this.channelColourArray  = [this.buttonLightCode(1, 0, 2),this.buttonLightCode(1, 0, 2),  this.buttonLightCode(1, 0, 3), this.buttonLightCode(1, 0, 1)];
		this.blinkColour = this.buttonLightCode(1, 2, 2);
        this.flashButtons();
    }

    buttonLightCode(intensity, blink, color) {
        let bIntensity = this.buttonIntensity[intensity];
        let bBlink = this.buttonBlink[blink];
        let bColor = this.launchButtonColor[color];

        return (bColor * 6) + (bIntensity * 3) + bBlink + 1;
    }

    flashButtons() {
		this.gridButtons.forEach((button, i) => {
			let channel = Math.floor(parseInt(i) / 16);
            let data1 = [144, button, this.channelColourArray[channel]];
            let data2 = [144, button, 0];

            let timeSend = window.performance.now() + (10 * parseInt(i));
            this.midiOut.send(data1);
            this.midiOut.send(data2, timeSend);
		});
    }

	highlightStep(step,on,mode) {
		//quick hijack of code: todo tidy up // this should do a quick midi implementation disregarding channels
		if (this.division === 16) {
			if (step % 2) return;
			step = step / 2;
		}
		//TODO: update this with real grid state
        this.updateButtons();
		let button = this.gridButtons[step];
		let col = on? this.channelColourArray[mode] : 0;
		this.midiOut.send([144, button, col]);
	}

    onMIDIMessage({data}) {
        let cmd = data[0] >> 4,
            channel = data[0] & 0xf,
            type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
            note = data[1],
            velocity = data[2];

		if (!velocity) return;

		if (cmd === 11) {
			this.routeMessage(cmd, channel, type, note, velocity);
		} else {
			if (type === 144) return this.noteOn(note, velocity);
		}
    }

	changeChannel(channel) {
	}

	noteOn(note, velocity) {

		let block = this.gridButtons.indexOf(note);
		if (block === -1 || block >= this.division) return;

        velocity = this.velocitySensitive ?  Math.pow(velocity / 127, 0.5) * 100 : 90;
		this.triggerMidi( block * (32 / this.division), velocity);
	}

	setGridData(gridData) {
		this.gridData = gridData;
		this.updateButtons();
	}

	setDivision(division) {
		this.division = division;
        this.clearButtons();
		this.updateButtons();
	}

	updateButtons() {
		if (!this.gridData) return;

		this.gridData[this.currentChannel].steps
			.filter((block, i) => !(i % (32 / this.division)))
			.forEach((block, i) => {
				let button = this.gridButtons[i];
				let channel = Math.floor(parseInt(i) / 16);
				let midiMsg = block ? [144, button, this.channelColourArray[channel]] : [144, button, 0]

				this.midiOut.send(midiMsg);
			})
	}

    clearButtons() {
        this.gridButtons.forEach(button => this.midiOut.send([144, button, 0]));
    }

    sendMsgToOutput(channel,note,time,on){
        let msg =  new Uint8Array( [144+channel, note, 127 ]);
        if(on){
            this.midiOut.send(msg);
        }else{
            msg =  new Uint8Array( [128+channel, note, 127 ]);
            this.midiOut.send(msg);
        }
    }

}

export default MidiControl;
