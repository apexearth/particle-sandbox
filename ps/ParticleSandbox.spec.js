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
    it('.select()', () => {
        ps.position.x = 0
        ps.position.y = 0
        let p1        = ps.addParticle({position: {x: 0, y: 0}})
        let p2        = ps.addParticle({position: {x: 10, y: 10}})
        let p3        = ps.addParticle({position: {x: -10, y: -10}})
        ps.select(0, 0, 10, 10)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(false)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p3)).to.equal(-1)
        ps.position.x = 5
        ps.position.y = 5
        ps.scale.x    = .5
        ps.scale.y    = .5
        ps.select(0, 0, 10, 10)
        expect(p1.selected).to.equal(true)
        expect(p2.selected).to.equal(true)
        expect(p3.selected).to.equal(true)
        expect(ps.selectedParticles.indexOf(p1)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p2)).to.be.gte(0)
        expect(ps.selectedParticles.indexOf(p3)).to.be.gte(0)

        ps.position.x -= 5
        ps.position.y -= 5
        ps.scale.x = 1
        ps.scale.y = 1
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

    it('.zoom', () => {
        const zoomRange  = view.zoomMax - view.zoomMin
        let initialScale = ps.targetScale.x
        ps.zoom += .1
        let postScale    = ps.targetScale.x
        expect(initialScale).to.be.lt(postScale)
        expect(postScale).to.equal(initialScale + zoomRange * .1)
        ps.zoom -= .1

        expect(ps.position.x).to.equal(250)
        expect(ps.position.y).to.equal(250)
        ps.zoom += .1
        ps.update(.1)
        expect(ps.position.x).to.equal(250)
        expect(ps.position.y).to.equal(250)
        ps.zoom -= .1
        ps.update(.1)
        expect(ps.position.x).to.equal(250)
        expect(ps.position.y).to.equal(250)

        ps.position.x = 0
        ps.position.y = 0
        ps.zoom -= .1
        ps.update(.1)
        ps.zoom -= .1
        ps.update(.1)
        expect(ps.position.x).to.equal(94.99999999999997)
        expect(ps.position.y).to.equal(94.99999999999997)
        ps.zoom += .1
        ps.update(.1)
        ps.zoom += .1
        ps.update(.1)
        expect(ps.position.x).to.equal(7.105427357601002e-15)
        expect(ps.position.y).to.equal(7.105427357601002e-15)
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

    it('add and remove SandboxObject', () => {
        const SandboxObject = require('./SandboxObject')
        let so = new SandboxObject({parent: ps})
        ps.addObject(so)
    })

    it('.cancelPreview()', () => {
        let hit                  = false
        ps.container.removeChild = particle => {
            hit = true
            expect(particle).to.exist
        }

        let particle = ps.previewParticle()
        ps.cancelPreview(particle)
        expect(hit).to.equal(true)
    })
})
