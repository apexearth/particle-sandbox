if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const Particle     = require('./Particle')
const ParticlePair = require('./ParticlePair')
const LinkedList   = require('./LinkedList')
const stats        = require('./stats')

const UserInput = require('./UserInput')

class ParticleSandbox {
    constructor(options) {
        this.options           = Object.assign(this.defaultOptions, options)
        this.particles         = []
        this.selectedParticles = []
        this.pairs             = [
            new LinkedList(),
            new LinkedList(),
            new LinkedList(),
        ]
        this.collisions        = []
        if (typeof window !== 'undefined') {
            this.root      = new PIXI.Container()
            this.container = new PIXI.Container()
            this.root.addChild(this.container)
        } else {
            this.container = {position: {x: 0, y: 0}, scale: {x: 1, y: 1}}
        }

        this._userInput = new UserInput({parent: this})
        this.components = [
            this._userInput
        ]
    }

    get userInput() {
        return this._userInput
    }

    get defaultOptions() {
        return {}
    }

    update(seconds) {
        this.updatePairs(this.pairs[0], seconds, this.pairs[0].count)
        this.updatePairs(this.pairs[1], seconds, this.pairs[1].count * .1)
        this.updatePairs(this.pairs[2], seconds, this.pairs[2].count * .02)
        this.particles.forEach(particle => particle.updateMovement(seconds))
        this.collisions.forEach(collision => {
            if (collision.particle1.mass <= 0) return
            if (collision.particle2.mass <= 0) return
            Particle.exchangeMass(collision)
            if (!collision.pair.previouslyCollided) {
                collision.particle1.bounce(collision.particle2)
                collision.particle1.uncollide(collision.particle2)
                collision.pair.previouslyCollided = true
            }
        })
        this.particles.forEach(particle => particle.update(seconds))
        this.collisions = []

        this.components.forEach(component => component.update(seconds))
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
                    pair.update()

                    if (pair.checkCollision) {
                        pair.particle1.updateCollisions(pair)
                    }
                    if (!pair.collided) {
                        pair.previouslyCollided = false
                        pair.particle1.updateAttract(pair)
                    }
                    pair.age = 0
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
                    x: 5000 * Math.random() - 2500,
                    y: 5000 * Math.random() - 2500,
                }
            })
        }
    }

    removeParticle(particle) {
        let index = this.particles.indexOf(particle)
        if (index >= 0) {
            this.particles.splice(index, 1)
            if (typeof window !== 'undefined') {
                this.container.removeChild(particle.container)
            }
        }
    }

    select(x1, y1, x2, y2, additive = false) {
        let minX = Math.min(x1, x2)
        let minY = Math.min(y1, y2)
        let maxX = Math.max(x1, x2)
        let maxY = Math.max(y1, y2)
        minX     = (minX - this.container.position.x) / this.container.scale.x
        minY     = (minY - this.container.position.y) / this.container.scale.y
        maxX     = (maxX - this.container.position.x) / this.container.scale.x
        maxY     = (maxY - this.container.position.y) / this.container.scale.y
        if (!additive) {
            this.selectedParticles.splice(0)
        }
        this.particles.forEach(particle => {
            if (!(
                    particle.position.x < minX ||
                    particle.position.x > maxX ||
                    particle.position.y < minY ||
                    particle.position.y > maxY
                )) {
                particle.select()
                this.selectedParticles.push(particle)
            } else if (!additive) {
                if (particle.selected) {
                    particle.deselect()
                    let index = this.selectedParticles.indexOf(particle)
                    if (index >= 0) {
                        this.selectedParticles.splice(index, 1)
                    }
                }
            }
        })
    }
}

module.exports = ParticleSandbox
