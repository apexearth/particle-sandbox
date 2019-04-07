import processor from './processor'

export default {
    update (seconds, state, ps)  {
        processor(seconds, state, ps, {
            onStart   : (seconds, state, ps, {x, y}) => {
                // TODO: This takes the current x/y from the frame, not the actual mouse click event's x/y, thus user might experience frustration.
                // Should fix later -- don't want to do a hack right now.
                state.start   = {}
                state.start.x = x
                state.start.y = y
                state.finish  = {}
            },
            onUpdate  : (seconds, state, ps, {x, y}) => {
                state.finish.x = x
                state.finish.y = y
            },
            onComplete: (seconds, state, ps, {x, y}) => {
                state.finish.x = x
                state.finish.y = y
                ps.select(state.start.x, state.start.y, state.finish.x, state.finish.y)
            },
        })
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
