const {version}       = require('../package.json')
const apex            = require('apex-app')
const ui              = require('./ui')
const ParticleSandbox = require('./ParticleSandbox')
const inputs          = require('./inputs')

const ps = new ParticleSandbox()
ui.initialize(ps)

const renderer = apex.createRenderer(ps, {resolution: window.devicePixelRatio || 1})
inputs.initialize(renderer.view)

ps.renderer = renderer

if (typeof window !== 'undefined') {
    window.ps       = ps
    window.renderer = renderer
}

const addParticles = () => {
    ps.addParticles(20)
    if (ps.particles.length < 250) {
        setTimeout(addParticles, 10)
    }
}
addParticles()
