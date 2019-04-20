import {setting} from 'apex-app'
import processor from './processor'

const settings = {
    radius         : setting(1, .5, 100),
    delay          : setting(.01, .01, .25),
    momentumX      : setting(0, -100, 100),
    momentumY      : setting(0, -100, 100),
    density        : setting(.75, .1, 10),
    color          : setting(0xffffff, 0, 0xffffff, 'color'),
    'random colors': setting(true, false, true, 'boolean')
}

const settingsLogic = {
    color: {
        get enabled() {
            return !settings['random colors'].value
        }
    }
}

export default {
    settings,
    settingsLogic,
    update(seconds, state, ps) {
        processor(seconds, state, ps, {
            onUpdate  : (seconds, state, ps, {x, y}) => {
                state.secondsSinceLastAdd = (state.secondsSinceLastAdd + seconds) || seconds
                if (state.secondsSinceLastAdd >= settings.delay.value) {
                    state.secondsSinceLastAdd = 0
                    state.stage               = 1
                    let particle              = ps.addParticle({
                        density : settings.density.value,
                        color   : settings.color.value,
                        position: {
                            x: (x - ps.position.x) / ps.scale.x,
                            y: (y - ps.position.y) / ps.scale.y
                        },
                        momentum: {
                            x: settings.momentumX.value,
                            y: settings.momentumY.value,
                        },
                        radius  : settings.radius.value
                    })
                    // Adjust momentum per selected particles.
                    if (ps.selectedObjects.length) {
                        let momentum = {x: 0, y: 0}
                        let count    = 0
                        for (let object of ps.selectedObjects) {
                            if (!object.momentum) continue
                            count++
                            momentum.x += object.momentum.x
                            momentum.y += object.momentum.y
                        }
                        momentum.x /= ps.selectedObjects.length
                        momentum.y /= ps.selectedObjects.length
                        particle.momentum.x = momentum.x
                        particle.momentum.y = momentum.y
                    }
                }
            },
            onComplete: (seconds, state, ps, {x, y}) => {
                state.secondsSinceLastAdd = settings.delay.value
            },
            onCancel  : (seconds, state, ps) => {
                state.secondsSinceLastAdd = settings.delay.value
            }
        })
    },
    draw(state, graphics) {

    }
}
