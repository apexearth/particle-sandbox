const inputs = require('../../inputs')

const settings = {
    initialRadius: 2,
    growthRate   : 10,
}

module.exports = {
    settings,
    update (seconds, state, ps)  {
        let {touchState} = state
        if (inputs('mouse2') || touchState.current.count > 1) {
            state.stage = 0
            if (state.particle) {
                ps.cancelPreview(state.particle)
                state.particle = null
            }
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
            if (!state.stage) {
                state.stage    = 1
                state.timeHeld = 0
                state.start    = {}
                state.start.x  = x
                state.start.y  = y
                state.finish   = {}
                state.particle = ps.previewParticle()
            }
            state.finish.x = x
            state.finish.y = y

            if (Math.sqrt(Math.pow(state.finish.x - state.start.x, 2) + Math.pow(state.finish.y - state.start.y, 2)) < 10) {
                state.timeHeld += seconds
            }
            state.particle.position.x = (state.start.x - ps.position.x) / ps.scale.x
            state.particle.position.y = (state.start.y - ps.position.y) / ps.scale.y
            state.particle.radius     = (settings.initialRadius + settings.growthRate * state.timeHeld) / ps.scale.x
            state.particle.draw()

        } else if (state.stage) {
            state.stage = 0
            let x, y
            if (state.inputType === 'mouse') {
                x = inputs('mouseX')
                y = inputs('mouseY')
            } else {
                x = touchState.previous.midpointX
                y = touchState.previous.midpointY
            }
            state.finish.x = x
            state.finish.y = y

            state.particle.momentum = {x: 0, y: 0}
            // Adjust momentum per selected particles.
            if (ps.selectedObjects.length) {
                let count = 0
                for (let object of ps.selectedObjects) {
                    if (!object.momentum) continue
                    count++
                    state.particle.momentum.x += object.momentum.x
                    state.particle.momentum.y += object.momentum.y
                }
                state.particle.momentum.x /= count
                state.particle.momentum.y /= count
            }
            state.particle.momentum.x += (state.start.x - state.finish.x) / ps.scale.x
            state.particle.momentum.y += (state.start.y - state.finish.y) / ps.scale.x

            ps.addParticle(state.particle)
            state.particle = null
        }
    },
    draw (state, graphics)  {
        if (!state.stage)  return
        graphics.lineStyle(1, 0x99ff99, .5)
        graphics.moveTo(state.start.x, state.start.y)
        graphics.lineTo(state.finish.x, state.finish.y)
        graphics.endFill()
    }
}
