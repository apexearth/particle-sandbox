const state = require('./state')

let actions = module.exports = {
    resumeGame  : () => {
        actions.changeScreen('GameScreen')
        state.ps.resumeRendering()
    },
    changeScreen: screen => {
        state.screen = screen
        state.emit('screen', screen)
    },
    startSandbox: () => {
        if (state.ps) {
            state.ps.kill()
        }
        const ParticleSandbox = require('../../ParticleSandbox')
        const ps              = new ParticleSandbox()
        state.ps              = ps

        ps.addParticle({
            position: {x: 0, y: 0},
            radius  : 10,
            density : 1,
        })
        ps.addParticles(300)
    }
}