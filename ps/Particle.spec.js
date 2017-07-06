const expect          = require('chai').expect
const ParticleSandbox = require('./ParticleSandbox')
const Particle        = require('./Particle')
const {simulation}    = require('./config')

describe("Particle", function () {
    it("2 particle interaction", function () {
        let ps = new ParticleSandbox()

        let p1 = ps.addParticle({
            density : 1,
            mass    : 2 * 2 * Math.PI,
            position: {x: 10, y: 0}
        })
        let p2 = ps.addParticle({
            density : 1,
            mass    : 2 * 2 * Math.PI,
            position: {x: -10, y: 0}
        })
        expect(p1.position.x).to.equal(10)
        expect(p1.position.y).to.equal(0)
        expect(p2.position.x).to.equal(-10)
        expect(p2.position.y).to.equal(0)

        ps.update(.01)
        expect(p1.position.x).to.lt(10)
        expect(p1.position.y).to.equal(0)
        expect(p2.position.x).to.gt(-10)
        expect(p2.position.y).to.equal(0)

        let limit = 100
        while (ps.particles.length > 1 && limit !== 0) {
            ps.update(.01)
            for (let particle of ps.particles) {
                expect(particle.position.x).to.be.a('number')
                expect(particle.position.y).to.be.a('number')
                if (particle.position.x === 2 || particle.position.x === -2)
                    limit = 1
            }
            limit--
        }

        expect(p1.mass).to.be.gt(12)
        expect(p1.position.x).to.gt(2)
        expect(p1.position.x).to.lt(3)
        expect(p1.momentum.x).to.gt(10)
        expect(p2.position.x).to.gt(-4)
        expect(p2.position.x).to.lt(-3)
        expect(p2.momentum.x).to.lt(-11)
    })

    it('.select() & .deselect()', function () {
        let ps = new ParticleSandbox()
        let p  = ps.addParticle()
        expect(p.selected).to.equal(false)
        p.select()
        expect(p.selected).to.equal(true)
        p.deselect()
        expect(p.selected).to.equal(false)
    })

    it('.updateAttract()', function () {
        let ps = new ParticleSandbox()
        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -10, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 10, y: 0}})

        ps.update(.1)
        expect(p1.momentum).to.deep.equal({x: 0.6283185307179586, y: 0})
        expect(p2.momentum).to.deep.equal({x: -0.6283185307179586, y: 0})

        let p3 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 0, y: 10}})
        ps.update(.1)
        expect(p1.momentum).to.deep.equal({
            "x": 2.166836767762864,
            "y": 0.9054842629776932
        })
        expect(p2.momentum).to.deep.equal({
            "x": -2.166836767762864,
            "y": 0.9054842629776932
        })
        expect(p3.momentum).to.deep.equal({
            "x": 0,
            "y": -1.8109685259553865
        })
    })

    it('.uncollide()', function () {
        let ps = new ParticleSandbox()
        let p1 = ps.addParticle({density: 1, radius: 2, position: {x: -1, y: 0}})
        let p2 = ps.addParticle({density: 1, radius: 2, position: {x: 1, y: 0}})
        Particle.uncollide({particle1: p1, particle2: p2})
        expect(p1.position.x).to.equal(-3)
        expect(p1.position.y).to.equal(0)
        expect(p2.position.x).to.equal(1)
        expect(p2.position.y).to.equal(0)

        p1.position.x = 0
        p1.position.y = -1
        p2.position.x = 0
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        Particle.uncollide({particle1: p1, particle2: p2})
        assertAlmostEqual(p1.position.x, 0)
        expect(p1.position.y).to.equal(-3)
        assertAlmostEqual(p2.position.x, 0)
        expect(p2.position.y).to.equal(1)

        p1.position.x = 0
        p1.position.y = 0
        p2.position.x = 1
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        Particle.uncollide({particle1: p1, particle2: p2})
        assertAlmostEqual(p1.position.x, -1.8284271247461903)
        assertAlmostEqual(p1.position.y, -1.8284271247461903)
        assertAlmostEqual(p2.position.x, 1)
        assertAlmostEqual(p2.position.y, 1)

        p1.radius     = 4
        p2.radius     = 2
        p1.position.x = 0
        p1.position.y = -1
        p2.position.x = 0
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        Particle.uncollide({particle1: p1, particle2: p2})
        assertAlmostEqual(p1.position.x, 0)
        assertAlmostEqual(p1.position.y, -1)
        assertAlmostEqual(p2.position.x, 0)
        assertAlmostEqual(p2.position.y, 5)

        p1 = ps.addParticle({density: 1, radius: 2, position: {x: -3, y: 0}})
        p2 = ps.addParticle({density: 1, radius: 2, position: {x: 1, y: 0}})
        Particle.exchangeMass({particle1: p1, particle2: p2})
        Particle.uncollide({particle1: p1, particle2: p2})
        expect(p1.position.x).to.equal(-2.999949998437418)
        expect(p1.position.y).to.equal(0)
        expect(p2.position.x).to.equal(1)
        expect(p2.position.y).to.equal(0)
    })

    it('.exchangeMass()', function () {
        let ps          = new ParticleSandbox()
        let initialMass = 10
        let p1          = ps.addParticle({density: 1, mass: initialMass, position: {x: -1, y: 0}})
        let p2          = ps.addParticle({density: 1, mass: initialMass * 2, position: {x: 1, y: 0}})
        Particle.exchangeMass({particle1: p1, particle2: p2})
        expect(p1.mass).to.equal(9.8)
        expect(p2.mass).to.equal(20.2)
        expect(p1.position.x).to.equal(-1)
        expect(p1.position.y).to.equal(0)
        expect(p2.position.x).to.equal(1)
        expect(p2.position.y).to.equal(0)
    })

    it('.distributeVelocity()', function () {
        let ps = new ParticleSandbox()

        let p1 = ps.addParticle({
            density : 1,
            mass    : 6,
            momentum: {x: 0, y: 0}
        })
        let p2 = ps.addParticle({
            density : 1,
            mass    : 2,
            momentum: {x: 8, y: 8}
        })

        p1.distributeVelocity(p2)
        expect(p1.momentum).to.deep.equal({
            x: 2, y: 2
        })
        expect(p2.momentum).to.deep.equal({
            x: 2, y: 2
        })
    })

    describe('.bounce()', function () {
        simulation.bouncePercentage = 1
        it('x, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 0}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 2, y: 0},
                momentum: {x: -1, y: 0}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(-1)
            expect(p2.momentum.x).to.equal(1)
        })
        it('x, different size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                mass    : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 0}
            })
            let p2 = ps.addParticle({
                density : 1,
                mass    : 2,
                position: {x: 2, y: 0},
                momentum: {x: -1, y: 0}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(-1.666666666666667)
            expect(p2.momentum.x).to.equal(0.33333333333333326)
        })
        it('x2, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 0}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 2, y: 0},
                momentum: {x: -3, y: 0}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(-3)
            expect(p2.momentum.x).to.equal(1)
        })
        it('y, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 0, y: 1}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 2},
                momentum: {x: 0, y: -1}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.y).to.equal(-1 * simulation.bouncePercentage)
            expect(p2.momentum.y).to.equal(1 * simulation.bouncePercentage)
        })
        it('xy, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 1}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 2, y: 2},
                momentum: {x: -1, y: -1}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(-1)
            expect(p1.momentum.y).to.equal(-1)
            expect(p2.momentum.x).to.equal(1.0000000000000004)
            expect(p2.momentum.y).to.equal(1)
        })
        it('xy2, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 1}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 2},
                momentum: {x: -1, y: -1}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(0.9999999999999999)
            expect(p1.momentum.y).to.equal(-1.0000000000000004)
            expect(p2.momentum.x).to.equal(-0.9999999999999999)
            expect(p2.momentum.y).to.equal(1.0000000000000004)
        })
        it('xy3, same size', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 1}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 2, y: 0},
                momentum: {x: -1, y: -1}
            })

            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.momentum.x).to.equal(-0.9999999999999998)
            expect(p1.momentum.y).to.equal(1)
            expect(p2.momentum.x).to.equal(1)
            expect(p2.momentum.y).to.equal(-1.0000000000000002)
        })
    })

    describe('heat', function () {
        it("self generated", function () {
            let ps = new ParticleSandbox()

            let p = ps.addParticle({
                density : 1,
                mass    : 1000,
                momentum: {x: 0, y: 0}
            })
            expect(p.heat).to.equal(0)
            p.density_prev = p.density - .01
            let i          = 100
            while (i--) {
                p.updateHeat(1)
            }
            expect(p.heat).to.be.gt(1)
        })
        it('bounce generates heat', function () {
            let ps = new ParticleSandbox()
            let p1 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 0, y: 0},
                momentum: {x: 1, y: 0}
            })
            let p2 = ps.addParticle({
                density : 1,
                radius  : 1,
                position: {x: 2, y: 0},
                momentum: {x: -1, y: 0}
            })

            expect(p1.heat).to.equal(0)
            expect(p2.heat).to.equal(0)
            Particle.bounce({particle1: p1, particle2: p2})
            expect(p1.heat).to.be.gt(0)
            expect(p2.heat).to.be.gt(0)
        })
    })
})

// For those annoying float value issues.
function assertAlmostEqual(a, b) {
    expect(a - b).to.be.lt(.000000000000001)
    expect(a - b).to.be.gt(-.000000000000001)
}