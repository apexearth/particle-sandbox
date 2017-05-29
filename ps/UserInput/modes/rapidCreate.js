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
        if (inputs('mouse2')) {
            state.stage               = 0
            state.secondsSinceLastAdd = settings.delay
        } else if (inputs('mouse0')) {
            state.secondsSinceLastAdd = (state.secondsSinceLastAdd + seconds) || seconds
            if (state.secondsSinceLastAdd >= settings.delay) {
                state.secondsSinceLastAdd = 0
                state.stage               = 1
                let particle              = ps.addParticle({
                    position: {
                        x: (inputs('mouseX') - ps.position.x) / ps.scale.x,
                        y: (inputs('mouseY') - ps.position.y) / ps.scale.y
                    },
                    momentum: {
                        x: settings.momentumX,
                        y: settings.momentumY,
                    },
                    radius  : settings.radius
                })
                // Adjust momentum per selected particles.
                if (ps.selectedParticles.length) {
                    let momentum = {x: 0, y: 0}
                    for (let particle of ps.selectedParticles) {
                        momentum.x += particle.momentum.x
                        momentum.y += particle.momentum.y
                    }
                    momentum.x /= ps.selectedParticles.length
                    momentum.y /= ps.selectedParticles.length
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