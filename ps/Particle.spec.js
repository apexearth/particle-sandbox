let expect          = require('chai').expect
let ParticleSandbox = require('./ParticleSandbox')

describe("Particle", function () {
    it("particle interaction", function () {
            let ps = new ParticleSandbox();

            let p1 = ps.addParticle({position: {x: -10, y: 0}})
            let p2 = ps.addParticle({position: {x: 10, y: 0}})
            expect(p1.position.x).to.equal(-10);
            expect(p1.position.y).to.equal(0);
            expect(p2.position.x).to.equal(10);
            expect(p2.position.y).to.equal(0);

            ps.update(.1);
            expect(p1.position.x).to.gt(-10);
            expect(p1.position.y).to.equal(0);
            expect(p2.position.x).to.lt(10);
            expect(p2.position.y).to.equal(0);

            let countDown = -1;
            while (ps.particles.length > 1 && countDown !== 0) {
                ps.update(.1)
                for (let particle of ps.particles) {
                    expect(particle.position.x).to.be.a('number')
                    expect(particle.position.y).to.be.a('number')
                    if (countDown < 0) {
                        if (particle.position.x === 2 || particle.position.x === -2)
                            countDown = 99;
                    }
                }
                countDown--;
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
        }
    );

    it('.uncollide()', function () {
        let ps = new ParticleSandbox();
        let p1 = ps.addParticle({position: {x: -1, y: 0}})
        let p2 = ps.addParticle({position: {x: 1, y: 0}})
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

    });
});

// For those annoying float value issues.
function assertAlmostEqual(a, b) {
    expect(a - b).to.be.lt(.000000000000001);
    expect(a - b).to.be.gt(-.000000000000001);
}