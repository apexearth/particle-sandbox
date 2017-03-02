let expect = require('chai').expect
let ParticleSandbox = require('./ParticleSandbox')

describe("Particle", function () {
    it("2 particle interaction", function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -10, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 10, y: 0}})
        expect(p1.position.x).to.equal(-10);
        expect(p1.position.y).to.equal(0);
        expect(p2.position.x).to.equal(10);
        expect(p2.position.y).to.equal(0);

        ps.update(.1);
        expect(p1.position.x).to.gt(-10);
        expect(p1.position.y).to.equal(0);
        expect(p2.position.x).to.lt(10);
        expect(p2.position.y).to.equal(0);

        let limit = 10000;
        while (ps.particles.length > 1 && limit !== 0) {
            ps.update(.1)
            for (let particle of ps.particles) {
                expect(particle.position.x).to.be.a('number')
                expect(particle.position.y).to.be.a('number')
                if (limit < 0) {
                    if (particle.position.x === 2 || particle.position.x === -2)
                        limit = 99;
                }
            }
            limit--;
        }

        // In a world of only two particles, they should come together, and end up equalizing positions and momentum.
        //   Account for any float value discrepancies.
        expect(p1.position.x).to.equal(-2)
        expect(p1.position.y).to.equal(0)
        expect(p1.momentum.x).to.equal(0)
        expect(p1.momentum.y).to.equal(0)
        expect(p2.position.x).to.equal(2)
        expect(p2.position.y).to.equal(0)
        expect(p2.momentum.x).to.equal(0)
        expect(p2.momentum.y).to.equal(0)
    });

    it('2 particle interaction, different sized', function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -2, y: 0}})
        let p2 = ps.addParticle({mass: 4 * 4 * Math.PI, position: {x: 4, y: 0}})

        const getMidpoint = () => {
            return {
                x: (p1.position.x + p2.position.x) / 2,
                y: (p1.position.y + p2.position.y) / 2
            };
        }

        let limit = 10000;
        let initialMidpoint = getMidpoint()
        while (ps.particles.length > 1 && limit-- > 0) {
            ps.update(.1);
            expect(getMidpoint()).to.deep.equal(initialMidpoint);
            assertAlmostEqual(p1.momentum.x, 0);
            assertAlmostEqual(p2.momentum.y, 0);
        }
    });

    it('3 particle interaction, different sized', function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({mass: 5 * 5 * Math.PI, position: {x: 0, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 2, y: 0}})
        let p3 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 0, y: 2}})

        const getMidpoint = () => {
            return {
                x: (p1.position.x + p2.position.x + p3.position.x) / 3,
                y: (p1.position.y + p2.position.y + p3.position.y) / 3
            };
        }

        let limit = 10000;
        let initialMidpoint = getMidpoint()
        while (ps.particles.length > 1 && limit-- > 0) {
            ps.update(.1);
            expect(getMidpoint()).to.deep.equal(initialMidpoint);
        }
    });

    it('.uncollide()', function () {
        let ps = new ParticleSandbox();
        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -1, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 1, y: 0}})
        p1.uncollide(p2);
        expect(p1.position.x).to.equal(-2);
        expect(p1.position.y).to.equal(0);
        expect(p2.position.x).to.equal(2);
        expect(p2.position.y).to.equal(0);

        p1.position.x = 0
        p1.position.y = -1
        p2.position.x = 0
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        p1.uncollide(p2);
        assertAlmostEqual(p1.position.x, 0);
        expect(p1.position.y).to.equal(-2);
        assertAlmostEqual(p2.position.x, 0);
        expect(p2.position.y).to.equal(2);

        p1.position.x = 0
        p1.position.y = 0
        p2.position.x = 1
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        p1.uncollide(p2);
        assertAlmostEqual(p1.position.x, -0.9142135623730949);
        assertAlmostEqual(p1.position.y, -0.9142135623730949);
        assertAlmostEqual(p2.position.x, 1.9142135623730951);
        assertAlmostEqual(p2.position.y, 1.9142135623730951);

        p1.radius = 4
        p2.radius = 2
        p1.position.x = 0
        p1.position.y = -1
        p2.position.x = 0
        p2.position.y = 1
        p1.updatePrevious()
        p2.updatePrevious()

        p1.uncollide(p2);
        assertAlmostEqual(p1.position.x, 0);
        assertAlmostEqual(p1.position.y, -2.3333333333333335);
        assertAlmostEqual(p2.position.x, 0);
        assertAlmostEqual(p2.position.y, 3.6666666666666665);
    });

    it('.exchangeMass()', function () {
        let ps = new ParticleSandbox()
        let initialMass = 10
        let p1 = ps.addParticle({mass: initialMass, position: {x: -1, y: 0}})
        let p2 = ps.addParticle({mass: initialMass * 2, position: {x: 1, y: 0}})
        p1.exchangeMass(p2)
        expect(p1.mass).to.equal(8)
        expect(p2.mass).to.equal(22)
    });

    it('.distributeVelocity()', function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({
            mass: 6,
            momentum: {x: 0, y: 0}
        })
        let p2 = ps.addParticle({
            mass: 2,
            momentum: {x: 8, y: 8}
        })

        p1.distributeVelocity(p2);
        expect(p1.momentum).to.deep.equal({
            x: 2, y: 2
        })
        expect(p2.momentum).to.deep.equal({
            x: 2, y: 2
        })
    })
});

// For those annoying float value issues.
function assertAlmostEqual(a, b) {
    expect(a - b).to.be.lt(.000000000000001);
    expect(a - b).to.be.gt(-.000000000000001);
}