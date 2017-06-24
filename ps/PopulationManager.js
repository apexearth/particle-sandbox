const config = require('./config')

class PopulationManger {
    constructor(ps, stats, history) {
        this.ps      = ps
        this.stats   = stats
        this.history = history
    }

    update(seconds) {
        const {
                  ps,
                  stats
              } = this

        if (this.stats.fps < config.limits.minFpsBeforeAutoRemoval && this.stats.simulation.particleCount > 500) {
            const center           = {position: stats.simulation.centerMass}
            const distantParticles = ps.particles
                                       .sort((p1, p2) => p1.distance(center) < p2.distance(center))
                                       .slice(0, Math.max(1, ps.particles.length * .005))
            distantParticles.forEach(p => ps.remove(p))
        }

    }
}

module.exports = PopulationManger