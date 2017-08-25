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
        if (state.ps) throw new Error('already started')

        console.log('starting sandbox')
        const ParticleSandbox = require('../../ParticleSandbox')
        const ps              = new ParticleSandbox()
        state.ps              = ps

        ps.addParticles(200)
        ps.addParticles(100, (ps.screenWidth + ps.screenHeight) / 2)
    }
}