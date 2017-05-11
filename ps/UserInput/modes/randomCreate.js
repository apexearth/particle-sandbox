const inputs = require('../../inputs')

const settings = {
    radius: 2,
    delay : .01,
    range : 100
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
                let randomAngle           = Math.PI * Math.random() * 2
                let randomDistance        = Math.random()
                ps.addParticle({
                    position: {
                        x: (inputs('mouseX') - ps.position.x + Math.cos(randomAngle) * settings.range * randomDistance) / ps.scale.x,
                        y: (inputs('mouseY') - ps.position.y + Math.sin(randomAngle) * settings.range * randomDistance) / ps.scale.y
                    },
                    radius  : settings.radius * Math.random() + settings.radius / 2
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