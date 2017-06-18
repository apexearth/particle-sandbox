const inputs = require('../../inputs')

module.exports = {
    update (seconds, state, ps)  {
        let {touchState} = state
        if (inputs('mouse2') || touchState.current.count > 1) {
            state.stage     = 0
            state.cancelled = true
        } else if (state.cancelled && !inputs('mouse2') && touchState.current.count === 0) {
            state.cancelled = false
        } else if (!state.cancelled && (inputs('mouse0') || touchState.current.count === 1)) {
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
                state.stage = 1
                // TODO: This takes the current x/y from the frame, not the actual mouse click event's x/y, thus user might experience frustration.
                // Should fix later -- don't want to do a hack right now.
                state.start   = {}
                state.start.x = x
                state.start.y = y
                state.finish  = {}
            }
            state.finish.x = x
            state.finish.y = y
        } else if (state.stage) {
            let x, y
            if (state.inputType === 'mouse') {
                x = inputs('mouseX')
                y = inputs('mouseY')
            } else {
                x = touchState.previous.midpointX
                y = touchState.previous.midpointY
            }
            state.stage    = 0
            state.finish.x = x
            state.finish.y = y
            ps.select(state.start.x, state.start.y, state.finish.x, state.finish.y)
        }
    },
    draw (state, graphics)  {
        if (!state.stage)  return
        graphics.beginFill(0x99ff99, .03)
        graphics.lineStyle(1, 0x99ff99, .5)
        graphics.drawRect(
            state.start.x, state.start.y,
            state.finish.x - state.start.x, state.finish.y - state.start.y
        )
        graphics.endFill()
    }
}