const inputs    = require('../../inputs')
const Generator = require('../../Generator')

const settings = Generator.defaultSettings

module.exports = {
    settings,
    update (seconds, state, ps)  {
        let {touchState} = state
        if (inputs('mouse0') || touchState.current.count === 1) {
            if (!state.stage) {
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
                state.stage    = 1
                state.timeHeld = 0
                state.start    = {}
                state.start.x  = x
                state.start.y  = y
                state.finish   = {}
                ps.addGenerator({
                    position: {
                        x: (state.start.x - ps.position.x) / ps.scale.x,
                        y: (state.start.y - ps.position.y) / ps.scale.y
                    },
                    settings: {}
                })
            }
        } else if (state.stage) {
            state.stage = 0
        }
    },
    draw (state, graphics)  {
    }
}