const inputs = require('../../inputs')

const settings = {
    radius   : 2,
    delay    : .01,
    momentumX: 0,
    momentumY: 0,
}

module.exports = {
    settings,
    update (seconds, state, ps)  {
        let {touchState} = state
        if (inputs('mouse2') || touchState.current.count > 1) {
            state.stage               = 0
            state.secondsSinceLastAdd = settings.delay
        } else if (inputs('mouse0') || touchState.current.count === 1) {
            let x, y
            if (inputs('mouse0')) {
                state.inputType = 'mouse'
                x               = inputs('mouseX')
                y               = inputs('mouseY')
            } else {
                state.inputType = 'touch'
                x               = touchState.current.midpointX
                y               = touchState.current.midpointY
            }
            state.secondsSinceLastAdd = (state.secondsSinceLastAdd + seconds) || seconds
            if (state.secondsSinceLastAdd >= settings.delay) {
                state.secondsSinceLastAdd = 0
                state.stage               = 1
                let particle              = ps.addParticle({
                    position: {
                        x: (x - ps.position.x) / ps.scale.x,
                        y: (y - ps.position.y) / ps.scale.y
                    },
                    momentum: {
                        x: settings.momentumX,
                        y: settings.momentumY,
                    },
                    radius  : settings.radius
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
        } else if (state.stage) {
            state.stage               = 0
            state.secondsSinceLastAdd = settings.delay
        }
    },
    draw (state, graphics)  {

    }
}