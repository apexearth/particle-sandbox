var expect = require('chai').expect
var ParticleSandbox = require('./ParticleSandbox')

describe("Particle", function () {
    it(".updateInteract()", function () {
        var ps = new ParticleSandbox();

        ps.addParticle({position: {x: -10, y: 0}})
        ps.addParticle({position: {x: 10, y: 0}})
        expect(ps.particles[0].position.x).to.equal(-10);
        expect(ps.particles[0].position.y).to.equal(0);
        expect(ps.particles[1].position.x).to.equal(10);
        expect(ps.particles[1].position.y).to.equal(0);

        ps.update(1);
        expect(ps.particles[0].position.x).to.gt(-10);
        expect(ps.particles[0].position.y).to.equal(0);
        expect(ps.particles[1].position.x).to.lt(10);
        expect(ps.particles[1].position.y).to.equal(0);

        ps.addParticle({position: {x: 0,y: 15}})

        ps.update(1);
        expect(ps.particles[0].position.y).to.gt(0);
        expect(ps.particles[1].position.y).to.gt(0);
    });
});