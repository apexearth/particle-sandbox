const expect          = require('chai').expect
const ParticleSandbox = require('./ParticleSandbox')
const {view}          = require('./config.js')

describe('ParticleSandbox', () => {
    let ps
    beforeEach(() => ps = new ParticleSandbox())

    it('run', () => {
        ps.addParticles(100)
        for (let i = 0; i < 10000; i++) {
            ps.update(1 / 60)
        }
    })

    it('.addParticle()', () => {
        ps.addParticle({position: {x: 1, y: 2}})
        let p1 = ps.particles[0]
        expect(p1.position).to.deep.equal({x: 1, y: 2})
    })
    it('.removeParticle()', () => {
        ps.addParticle({position: {x: 1, y: 2}})
        ps.removeParticle(ps.particles[0])
        expect(ps.particles.length).to.equal(0)
    })

    it('.addGenerator()', () => {
        ps.addGenerator({position: {x: 1, y: 2}})
        let p1 = ps.generators[0]
        expect(p1.position).to.deep.equal({x: 1, y: 2})
    })
    it('.removeGenerator()', () => {
        ps.addGenerator({position: {x: 1, y: 2}})
        ps.removeGenerator(ps.generators[0])
        expect(ps.particles.length).to.equal(0)
    })
})
