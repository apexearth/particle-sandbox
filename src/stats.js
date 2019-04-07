let stats = {
    fps       : 60,
    fpsCounter: 0,
    fpsStart  : Date.now(),

    simulation: {
        particleCount    : 0,
        particlePairCount: 0,
        generatorCount   : 0,
        centerMass       : {x: 0, y: 0},
        totalMass        : 0
    },
    update    : (seconds, ps) => {
        stats.fpsCounter++
        if (Date.now() - stats.fpsStart >= 1000) {
            stats.fps        = stats.fpsCounter
            stats.fpsCounter = 0
            stats.fpsStart   = Date.now()
        }

        stats.simulation.centerMass.x = 0
        stats.simulation.centerMass.y = 0
        stats.simulation.totalMass    = 0
        ps.particles.forEach(particle => {
            stats.simulation.centerMass.x += particle.position.x * particle.mass
            stats.simulation.centerMass.x += particle.position.y * particle.mass
            stats.simulation.totalMass += particle.mass
        })
        stats.simulation.centerMass.x /= stats.simulation.totalMass
        stats.simulation.centerMass.y /= stats.simulation.totalMass
    }
}

export default stats
