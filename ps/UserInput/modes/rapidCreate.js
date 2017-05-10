const inputs = require('../../inputs')

const settings = {
    radius: 2,
    delay : .01,
}

module.exports = {
    settings,
    update (seconds, state, ps)  {
        if (inputs('mouse2')) {
            state.stage               = 0
            state.secondsSinceLastAdd = settings.delay
        } else if (inputs('mouse0')) {
            state.secondsSinceLastAdd = (state.secondsSinceLastAdd + seconds) || seconds
            if (state.secondsSinceLastAdd >= settings.delay) {
                state.secondsSinceLastAdd = 0
                state.stage               = 1
                ps.addParticle({
                    position: {
                        x: (inputs('mouseX') - ps.position.x) / ps.scale.x,
                        y: (inputs('mouseY') - ps.position.y) / ps.scale.y
                    },
                    radius  : settings.radius
                })
            }
        } else if (state.stage) {
            state.stage               = 0
            state.secondsSinceLastAdd = settings.delay
        }
    },
    draw (state, graphics)  {
        
    }
}