const ParticleSandbox = require('./ParticleSandbox')

describe('ParticleSandbox', () => {
    it('run', () => {
        let ps = new ParticleSandbox()
        ps.addParticles(100);
        for (let i = 0; i < 1000; i++) {
            ps.update(1 / 60)
        }
    })
})