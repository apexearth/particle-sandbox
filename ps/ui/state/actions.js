const state       = require('./state')
const advertising = require('../advertising')

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

        ps.addParticle({
            position: {x: 0, y: 0},
            radius  : 10,
            density : 1,
        })
        ps.addParticles(300)
    }
}