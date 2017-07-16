const state = require('./state')

let actions = module.exports = {
    resumeGame     : () => {
        actions.changeScreen('GameScreen')
        state.ps.resumeRendering()
    },
    gotoTitleScreen: () => {
        actions.changeScreen('TitleScreen')
        if (state.ps) {
            state.ps.pauseRendering()
        }
    },
    changeScreen   : screen => {
        state.screen = screen
        state.emit('screen', screen)
    },
    startSandbox   : () => {
        if (state.ps) {
            state.ps.kill()
        }
        const ParticleSandbox = require('../../ParticleSandbox')
        const ps              = new ParticleSandbox()
        state.ps              = ps


        actions.changeScreen('GameScreen')

        const addParticles = () => {
            ps.addParticles(20)
            if (ps.particles.length < 250) {
                setTimeout(addParticles, 10)
            }
        }
        addParticles()
    }

}