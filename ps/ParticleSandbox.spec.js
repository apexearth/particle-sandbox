const expect          = require('chai').expect
const ParticleSandbox = require('./ParticleSandbox')
const {view}          = require('./config.js')

describe('ParticleSandbox', () => {
    let ps
    beforeEach(() => ps = new ParticleSandbox())

    it('run', () => {
        ps.addParticles(100)
        for (let i = 0; i < 100; i++) {
            ps.update(1 / 60)
        }
    })

    it('two particles, dominant particle should not move', () => {
        let p1 = ps.addParticle({density: 1, radius: 2, position: {x: -2, y: 0}})
        let p2 = ps.addParticle({density: 1, radius: 2, position: {x: 2, y: 0}})
        ps.update(1 / 60)
        let i  = 1000
        while (i--) {
            ps.update(1 / 60)
            expect(Math.abs(p2.position.x - 2)).to.be.lt(.00001)
            expect(p2.position.y).to.be.lt(.00001)
        }
    })

    it('.addParticle()', () => {
        ps.addParticle({position: {x: 1, y: 2}})
        let p1 = ps.particles[0]
        expect(p1.position).to.deep.equal({x: 1, y: 2})
    })
    it('.removeParticle()', () => {
        ps.addParticle({position: {x: 1, y: 2}})
        ps._removeParticle(ps.particles[0])
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
