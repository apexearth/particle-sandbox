import angles from './angles'
import {AppObject, setting} from 'apex-app'
import settings from './settings'


const defaultSettings = {
    delay       : setting(1, .01, 10),
    count       : setting(1, 1, 100),
    radius      : setting(1, .5, 100),
    speed       : setting(10, 0, 100),
    minDirection: setting(0, 0, 360),
    maxDirection: setting(360, 0, 360),
    minDensity  : setting(.5, .1, 10),
    maxDensity  : setting(1, .1, 10),
    range       : setting(0, 0, 10000),
}

const defaultState = {
    delay: 0
}

class Generator extends AppObject {
    constructor({app, parent, position, settings}) {
        super({app, parent, position})
        this.type           = 'generator'
        const defaultValues = {}
        Object.keys(defaultSettings).forEach(key => defaultValues[key] = defaultSettings[key].value)
        this.settings = Object.assign({}, defaultValues, settings)
        this.state    = Object.assign({}, defaultState)
        this.draw()
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
                    density : this.settings.minDensity + Math.random() * (this.settings.maxDensity - this.settings.minDensity),
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

    draw() {
        if (typeof window !== 'undefined') {
            let size = Math.max(10, this.settings.range, this.settings.radius)
            this.graphics.clear()
            this.graphics.alpha = this.selected ? .2 : .1
            this.graphics.beginFill(settings.invertColors ? 0x333333 : 0xcccccc)
            this.graphics.drawRect(-size, -size, size * 2, size * 2)
            this.graphics.endFill()
        }
    }
}

export default Generator
