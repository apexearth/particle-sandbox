let expect          = require('chai').expect
let ParticleSandbox = require('./ParticleSandbox')

describe("Particle", function () {
    it("2 particle interaction", function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 10, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -10, y: 0}})
        expect(p1.position.x).to.equal(10);
        expect(p1.position.y).to.equal(0);
        expect(p2.position.x).to.equal(-10);
        expect(p2.position.y).to.equal(0);

        ps.update(.01);
        expect(p1.position.x).to.lt(10);
        expect(p1.position.y).to.equal(0);
        expect(p2.position.x).to.gt(-10);
        expect(p2.position.y).to.equal(0);

        let limit = 10000;
        while (ps.particles.length > 1 && limit !== 0) {
            ps.update(.01)
            for (let particle of ps.particles) {
                expect(particle.position.x).to.be.a('number')
                expect(particle.position.y).to.be.a('number')
                if (particle.position.x === 2 || particle.position.x === -2)
                    limit = 1;
            }
            limit--;
        }

        // In a world of only two particles, they should come together, and end up equalizing positions and momentum.
        //   Account for any float value discrepancies.
        // If failing, check they they didn't move so quickly that hit-detection missed the pass.
        expect(p1.position.x).to.equal(2)
        expect(p1.position.y).to.equal(0)
        expect(p1.momentum.x).to.equal(0)
        expect(p1.momentum.y).to.equal(0)
        expect(p2.position.x).to.equal(-2)
        expect(p2.position.y).to.equal(0)
        expect(p2.momentum.x).to.equal(0)
        expect(p2.momentum.y).to.equal(0)
    });

    it('.updateAttract()', function () {
        let ps = new ParticleSandbox();
        let p1 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: -10, y: 0}})
        let p2 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 10, y: 0}})

        ps.update(.1);
        expect(p1.momentum).to.deep.equal({x: 0.313767301057426, y: 0})
        expect(p2.momentum).to.deep.equal({x: -0.313767301057426, y: 0})

        let p3 = ps.addParticle({mass: 2 * 2 * Math.PI, position: {x: 0, y: 10}})
        ps.update(.1);
        expect(p1.momentum).to.deep.equal({
            "x": 1.0714040188640783,
            "y": 0.44526899193230557
        })
        expect(p2.momentum).to.deep.equal({
            "x": -1.0714040188640783,
            "y": 0.44526899193230557
        })
        expect(p3.momentum).to.deep.equal({
            "x": 0,
            "y": -0.8905379838646111
        })
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

        p1.radius     = 4
        p2.radius     = 2
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
        let ps          = new ParticleSandbox()
        let initialMass = 10
        let p1          = ps.addParticle({mass: initialMass, position: {x: -1, y: 0}})
        let p2          = ps.addParticle({mass: initialMass * 2, position: {x: 1, y: 0}})
        p1.exchangeMass(p2)
        expect(p1.mass).to.equal(9.8)
        expect(p2.mass).to.equal(20.2)
    });

    it('.distributeVelocity()', function () {
        let ps = new ParticleSandbox();

        let p1 = ps.addParticle({
            mass    : 6,
            momentum: {x: 0, y: 0}
        })
        let p2 = ps.addParticle({
            mass    : 2,
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