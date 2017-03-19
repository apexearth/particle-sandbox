if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const Particle     = require('./Particle')
const ParticlePair = require('./ParticlePair')
const LinkedList   = require('./LinkedList')
const stats        = require('./stats')

class ParticleSandbox {
    constructor(options) {
        this.options    = Object.assign(this.defaultOptions, options)
        this.particles  = []
        this.pairs      = [
            new LinkedList(),
            new LinkedList(),
            new LinkedList(),
        ]
        this.collisions = []
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
        }
    }

    update(seconds) {
        this.updatePairs(this.pairs[0], seconds, this.pairs[0].count)
        this.updatePairs(this.pairs[1], seconds, this.pairs[1].count * .2)
        this.updatePairs(this.pairs[2], seconds, this.pairs[2].count * .02)
        this.particles.forEach(particle => particle.updateMovement(seconds))
        this.collisions.forEach(collision => {
            if (collision.particle1.mass <= 0) return
            if (collision.particle2.mass <= 0) return
            Particle.exchangeMass(collision)
            if (!collision.pair.previouslyCollided) {
                collision.particle1.bounce(collision.particle2)
                collision.particle1.uncollide(collision.particle2)
                collision.pair.previouslyCollided = true;
            }
        })
        this.particles.forEach(particle => particle.update(seconds))
        this.collisions = []

        stats.update(this)
    }

    updatePairs(root, seconds, count) {
        let pair
        // Run calculations on interactions by pairs.
        // First entry is a blank LinkedList object.
        while (count-- > 0 && (pair = (root.next || (root.current = root.first)))) {
            pair.age += seconds
            if (pair.age >= pair.ageUntilUpdate) {
                if (pair.particle1.mass <= 0 || pair.particle2.mass <= 0) {
                    //console.log('removing pair - mass')
                    root.remove(pair)
                } else {
                    this.updatePairLocation(pair, root)
                    if (pair.checkCollision) {
                        pair.particle1.updateCollisions(pair)
                    }
                    if (!pair.collided) {
                        pair.previouslyCollided = false;
                        pair.particle1.updateAttract(pair)
                    }
                    pair.update()
                    pair.age = 0;
                }
            }
        }
    }

    updatePairLocation(pair, root) {
        if (pair.distance > (pair.particle1.radius * pair.particle2.radius * 200)) {
            if (root !== this.pairs[0]) {
                if (root) {
                    // console.log('removing pair 2 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[2].add(pair)
            }
        } else if (pair.distance > (pair.particle1.radius * pair.particle2.radius * 50)) {
            if (root !== this.pairs[0]) {
                if (root) {
                    // console.log('removing pair 1 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[1].add(pair)
            }
        } else {
            if (root !== this.pairs[0]) {
                if (root) {
                    // console.log('removing pair 0 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[0].add(pair)
            }
        }
    }

    addParticle(options) {
        options      = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            parent: this
        }, options))
        this.particles.forEach(other => {
            this.updatePairLocation(new ParticlePair(particle, other))
        })
        this.particles.push(particle)
        return particle
    }

    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.addParticle({
                mass    : 20 + Math.random() * 10,
                position: {
                    x: 2000 * Math.random() - 1000,
                    y: 2000 * Math.random() - 1000,
                }
            });
        }
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
