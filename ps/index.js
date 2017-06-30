const {version}          = require('../package.json')
const {renderer}         = require('apex-app')
const ui                 = require('./ui')
const ParticleSandbox    = require('./ParticleSandbox')
const input              = require('./inputs')
const ps                 = new ParticleSandbox()

ui.initialize(ps)
renderer.initialize(ps, input)

if (typeof window !== 'undefined') window.ps = ps

const addParticles = () => {
    ps.addParticles(20)
    if (ps.particles.length < 250) {
        setTimeout(addParticles, 10)
    }
}
addParticles()
