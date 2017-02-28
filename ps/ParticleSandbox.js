if (typeof window !== 'undefined') {
    var PIXI = require('pixi.js');
}
var Particle = require('./Particle')
var Quadtree = require('../../endless-quadtree')

class ParticleSandbox {
    constructor(options) {
        this.options    = Object.assign(this.defaultOptions, options)
        this.particles  = []
        this.collisions = []
        this.quadtree   = new Quadtree({
            dimensions    : ['x', 'y'],
            entityLimit   : 20,
            entityCoordKey: 'position'
        })
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
        }
    }

    update(seconds) {
        this.particles.forEach(particle => particle.updateAttract(seconds))
        this.particles.forEach(particle => particle.updateMovement(seconds))
        this.particles.forEach(particle => particle.updateCollisions(seconds))
        this.collisions.forEach(collision => {
            collision.particle1.exchangeMass(collision.particle2);
            collision.particle1.uncollide(collision.particle2);
            collision.particle1.distributeVelocity(collision.particle2);
        })
        this.particles.forEach(particle => particle.update(seconds))
        this.collisions = []
        this.quadtree.update();
    }

    addParticle(options) {
        options      = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            parent: this
        }, options));
        this.particles.push(particle)
        this.quadtree.add(particle);
        return particle;
    }

    removeParticle(particle) {
        let index = this.particles.indexOf(particle);
        if (index >= 0) {
            this.particles.splice(index, 1);
            if (typeof window !== 'undefined') {
                this.container.removeChild(particle.container);
            }
            this.quadtree.remove(particle);
        }
    }

    get defaultOptions() {
        return {}
    }
}

module.exports = ParticleSandbox
