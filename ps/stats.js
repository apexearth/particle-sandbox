let stats = module.exports = {
    fps       : 0,
    fpsCounter: 0,
    fpsStart  : 0,

    update: ps => {
        stats.particleCount = ps.particles.length
    }
}