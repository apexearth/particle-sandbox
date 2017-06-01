const SandboxObject = require('./SandboxObject')

const defaultSettings = {
    delay       : .1,
    count       : 1,
    radius      : 1,
    speed       : 5,
    minDirection: 0,
    maxDirection: 360,
    range       : 0
}

const defaultState = {
    delay: 0
}

class Generator extends SandboxObject {
    constructor({parent, position, settings}) {
        super({parent, position})
        this.settings = Object.assign({}, defaultSettings, settings)
        this.state    = Object.assign({}, defaultState)
    }

    static get defaultSettings() {
        return defaultSettings
    }

    static get defaultState() {
        return defaultState
    }

    update(seconds) {
        this.state.delay += seconds
        if (this.state.delay >= this.settings.delay) {
            this.state.delay = 0
            this.parent.addParticle()
        }
    }
}

module.exports = Generator
