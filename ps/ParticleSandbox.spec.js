const expect          = require('chai').expect
const ParticleSandbox = require('./ParticleSandbox')

describe('ParticleSandbox', () => {
    it('run', () => {
        let ps = new ParticleSandbox()
        ps.addParticles(100);
        for (let i = 0; i < 10000; i++) {
            ps.update(1 / 60)
        }
    })
    it('.select()', () => {
        let ps = new ParticleSandbox()
        let p1 = ps.addParticle({position: {x: 0, y: 0}})
        let p2 = ps.addParticle({position: {x: 10, y: 10}})
        let p3 = ps.addParticle({position: {x: -10, y: -10}})
        ps.select(0,0,10,10);
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(false)
        ps.container.position.x = 5
        ps.container.position.y = 5
        ps.container.scale.x = .5
        ps.container.scale.y = .5
        ps.select(0,0,10,10);
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(true)
    })
})
