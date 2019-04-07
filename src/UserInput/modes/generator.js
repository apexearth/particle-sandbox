import processor from './processor'
import Generator from '../../Generator'

const settings = Generator.defaultSettings

export default {
    settings,
    update (seconds, state, ps)  {
        processor(seconds, state, ps, {
            onComplete: (seconds, state, ps, {x, y}) => {
                state.start   = {}
                state.start.x = x
                state.start.y = y
                state.finish  = {}
                ps.addGenerator({
                    position: {
                        x: (state.start.x - ps.position.x) / ps.scale.x,
                        y: (state.start.y - ps.position.y) / ps.scale.y
                    },
                    settings: {}
                })
            },
        })
    },
    draw (state, graphics)  {
    }
}
