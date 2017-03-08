if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js');
}
const Particle = require('./Particle')

class ParticleSandbox {
    constructor(options) {
        this.options    = Object.assign(this.defaultOptions, options)
        this.particles  = []
        this.collisions = []
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
        }
    }

    update(seconds) {
        this.particles.forEach(particle => particle.color = 0xffffff)
        this.particles.forEach(particle => particle.updateAttract(seconds))
        this.particles.forEach(particle => particle.updateMovement(seconds))
        this.particles.forEach(particle => particle.updateCollisions(seconds))
        this.collisions.forEach(collision => {
            if (collision.particle1.mass <= 0) return;
            if (collision.particle2.mass <= 0) return;
            collision.particle1.uncollide(collision.particle2);
            collision.particle1.distributeVelocity(collision.particle2);
            collision.particle1.exchangeMass(collision.particle2);
        })
        this.particles.forEach(particle => particle.update(seconds))
        this.collisions = []
    }

    addParticle(options) {
        options      = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            parent: this
        }, options));
        this.particles.forEach(other => other.analyzePosition(particle))
        this.particles.push(particle)
        return particle;
    }

    removeParticle(particle) {
        let index = this.particles.indexOf(particle);
        if (index >= 0) {
            this.particles.splice(index, 1);
            if (typeof window !== 'undefined') {
                this.container.removeChild(particle.container);
            }
        }
    }

    get defaultOptions() {
        return {}
    }
}

module.exports = ParticleSandbox
