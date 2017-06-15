const inputs = require('../../inputs')

const settings = {
    radius      : 2,
    delay       : .01,
    range       : 100,
    momentumMinX: -30,
    momentumMinY: -30,
    momentumMaxX: 30,
    momentumMaxY: 30,
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
                let particle              = ps.addParticle({
                    position: {
                        x: (inputs('mouseX') - ps.position.x + Math.cos(randomAngle) * settings.range * randomDistance) / ps.scale.x,
                        y: (inputs('mouseY') - ps.position.y + Math.sin(randomAngle) * settings.range * randomDistance) / ps.scale.y
                    },
                    momentum: {
                        x: settings.momentumMinX + Math.random() * (settings.momentumMaxX - settings.momentumMinX),
                        y: settings.momentumMinY + Math.random() * (settings.momentumMaxY - settings.momentumMinY),
                    },
                    radius  : settings.radius * Math.random() + settings.radius / 2
                })
                // Adjust momentum per selected particles.
                if (ps.selectedObjects.length) {
                    let momentum = {x: 0, y: 0}
                    let count    = 0
                    for (let object of ps.selectedObjects) {
                        if (!object.momentum) continue
                        count++
                        momentum.x += object.momentum.x
                        momentum.y += object.momentum.y
                    }
                    momentum.x /= ps.selectedObjects.length
                    momentum.y /= ps.selectedObjects.length
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