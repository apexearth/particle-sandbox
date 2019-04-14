import "jest-canvas-mock"
const expect = require('chai').expect
import ParticleSandbox from './ParticleSandbox'

describe('Generator', function () {
    let ps

    beforeEach(() => ps = new ParticleSandbox())

    it('new', function () {
        expect(ps.particles.length).to.equal(0)
        const generator   = ps.addGenerator({
            position: {x: 5, y: 5},
            settings: {
                delay       : 1,
                count       : 2,
                radius      : 1,
                speed       : 5,
                minDirection: 0,
                maxDirection: 0,
                range       : 5
            }
        })
        let expectedDelay = generator.settings.delay
        generator.update(expectedDelay / 2)
        expect(ps.particles.length).to.equal(0)
        expect(generator.state.delay).to.equal(expectedDelay / 2)
        generator.update(expectedDelay / 2)
        expect(ps.particles.length).to.equal(2)
        expect(generator.state.delay).to.equal(0)
        expect(ps.particles[0].position.x).to.be.lte(10)
        expect(ps.particles[0].position.x).to.be.gte(-10)
        expect(ps.particles[0].position.y).to.be.lte(10)
        expect(ps.particles[0].position.y).to.be.gte(-10)
        expect(ps.particles[0].momentum.x).to.equal(5)
        expect(ps.particles[0].momentum.y).to.equal(0)
    })
})
