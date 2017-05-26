const inputs = require('../../inputs')

module.exports = {
    update (seconds, state, ps)  {
        if (inputs('mouse0')) {
            if (!state.stage) {
                state.stage = 1
                // TODO: This takes the current x/y from the frame, not the actual mouse click event's x/y, thus user might experience frustration.
                // Should fix later -- don't want to do a hack right now.
                state.start   = {}
                state.start.x = inputs('mouseX')
                state.start.y = inputs('mouseY')
                state.finish  = {}
            }
            state.finish.x = inputs('mouseX')
            state.finish.y = inputs('mouseY')
        } else if (state.stage) {
            state.stage    = 0
            state.finish.x = inputs('mouseX')
            state.finish.y = inputs('mouseY')
            ps.select(state.start.x, state.start.y, state.finish.x, state.finish.y)
        }
        if (inputs('delete')) {
            ps.removeSelectedParticles()
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