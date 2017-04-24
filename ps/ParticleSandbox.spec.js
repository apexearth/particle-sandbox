const expect          = require('chai').expect
const ParticleSandbox = require('./ParticleSandbox')

describe('ParticleSandbox', () => {
    it('run', () => {
        let ps = new ParticleSandbox()
        ps.addParticles(100)
        for (let i = 0; i < 10000; i++) {
            ps.update(1 / 60)
        }
    })
    it('.select()', () => {
        let ps = new ParticleSandbox()
        let p1 = ps.addParticle({position: {x: 0, y: 0}})
        let p2 = ps.addParticle({position: {x: 10, y: 10}})
        let p3 = ps.addParticle({position: {x: -10, y: -10}})
        ps.select(0, 0, 10, 10)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(false)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p3)).to.equal(-1)
        ps.container.position.x = 5
        ps.container.position.y = 5
        ps.container.scale.x    = .5
        ps.container.scale.y    = .5
        ps.select(0, 0, 10, 10)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(true)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p3)).to.be.gte(0)

        ps.container.position.x = 0
        ps.container.position.y = 0
        ps.container.scale.x    = 1
        ps.container.scale.y    = 1
        ps.select(0, 0, 1, 1)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(false)
        expect(p3.selected).to.equal(false)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.equal(-1)
        expect(ps.selectedParticles.indexOf(p3)).to.equal(-1)

        ps.select(10, 10, 11, 11, true)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(false)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p3)).to.equal(-1)
    })

    it('.zoomIn()', () => {
        let ps           = new ParticleSandbox()
        let initialScale = ps.container.scale.x
        ps.zoomIn()
        let postScale = ps.container.scale.x
        expect(initialScale).to.be.lt(postScale)
        expect(postScale).to.equal(initialScale + .1)
    })
    it('.zoomOut()', () => {
        let ps           = new ParticleSandbox()
        let initialScale = ps.container.scale.x
        ps.zoomOut()
        let postScale = ps.container.scale.x
        expect(initialScale).to.be.gt(postScale)
        expect(postScale).to.equal(initialScale - .1)
    })
})
