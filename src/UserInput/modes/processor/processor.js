const inputs = require('../../../inputs')

export default function (seconds, state, ps, {
    onCancel = () => undefined,
    onStart = () => undefined,
    onUpdate = () => undefined,
    onComplete = () => undefined,
}) {
    let {touchState} = state
    if (inputs('mouse2') || touchState.current.count > 1) {
        state.stage     = 0
        state.cancelled = true
        onCancel(seconds, state, ps)
    } else if (state.stage === 0 && !inputs('mouse0') && !touchState.current.count) {
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
            onStart(seconds, state, ps, {x, y})
        }
        onUpdate(seconds, state, ps, {x, y})
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
        onComplete(seconds, state, ps, {x, y})
        state.particle = null
    }
}
