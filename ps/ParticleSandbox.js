var PIXI = require('pixi.js');
var Particle = require('./Particle')
var Quadtree = require('../../endless-quadtree')

class ParticleSandbox {
    constructor(options) {
        this.options = Object.assign(this.defaultOptions, options)
        this.particles = []
        this.quadtree = new Quadtree({
            dimensions: ['x', 'y'],
            entityLimit: 10,
            childCoordKey: 'position'
        })
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
        }
    }

    update(seconds) {
        this.particles.forEach(particle => particle.updateInteract(seconds))
        this.particles.forEach(particle => particle.updateMovement(seconds))
        this.particles.forEach(particle => particle.update(seconds))
        this.quadtree.update();
    }

    addParticle(options) {
        options = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            parent: this
        }, options));
        this.particles.push(particle)
        this.quadtree.add(particle);
    }

    get defaultOptions() {
        return {}
    }
}

module.exports = ParticleSandbox
