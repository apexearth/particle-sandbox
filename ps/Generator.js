const angles        = require('./angles')
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
            for (let i = 0; i < this.settings.count; i++) {
                this.parent.addParticle({
                    position: {
                        x: this.position.x - this.settings.range + (Math.random() * this.settings.range * 2),
                        y: this.position.y - this.settings.range + (Math.random() * this.settings.range * 2)
                    },
                    momentum: {
                        x: Math.cos(angles.randomAngleDeg(this.settings.minDirection, this.settings.maxDirection)) * this.settings.speed,
                        y: Math.sin(angles.randomAngleDeg(this.settings.minDirection, this.settings.maxDirection)) * this.settings.speed
                    }
                })
            }
        }
    }
}

module.exports = Generator
