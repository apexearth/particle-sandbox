const _window = require('./window')

const {
          App
      }                      = require('apex-app')
const Generator              = require('./Generator')
const Particle               = require('./Particle')
const ParticlePair           = require('./ParticlePair')
const ParticlePairLinkedList = require('./ParticlePairLinkedList')
const StatsHistory           = require('./StatsHistory')
const PopulationManager      = require('./PopulationManager')
const stats                  = require('./stats')

const UserInput = require('./UserInput')
const {
          view,
          simulation,
          performance
      }         = require('./config')


class ParticleSandbox extends App {
    constructor(options) {
        super(Object.assign({view}, options))

        this.particles            = []
        this.pairs                = [
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
        ]
        this.collisions           = []
        this.generators           = []
        this.container.position.x = this.screenWidth / 2
        this.container.position.y = this.screenHeight / 2

        this._userInput = new UserInput({parent: this})
        this.modes      = {
            followSelection: true
        }

        this.statsHistory      = new StatsHistory(stats)
        this.populationManager = new PopulationManager(this, stats, this.statsHistory)
    }

    get stats() {
        return stats
    }

    get userInput() {
        return this._userInput
    }

    update(seconds) {
        super.update(seconds)
        this._userInput.update(seconds)

        this.updateZoom(seconds)

        if (this.paused) return


        this.updatePairs(this.pairs[0], seconds, this.pairs[0].count * performance.updateFrequency1)
        this.updatePairs(this.pairs[1], seconds, this.pairs[1].count * performance.updateFrequency2)
        this.updatePairs(this.pairs[2], seconds, this.pairs[2].count * performance.updateFrequency3)

        this.objects.forEach(object => object.update(seconds))

        this.collisions.forEach(collision => {
            if (collision.particle1.mass <= 0) return
            if (collision.particle2.mass <= 0) return

            Particle.exchangeMass(collision)
            if (!collision.pair.previouslyCollided) {
                Particle.bounce(collision)
                Particle.uncollide(collision)
            }
            collision.pair.previouslyCollided = true
        })
        this.particles.forEach(particle => {
            if (particle.mass <= 0) {
                this.remove(particle)
            }
        })
        this.collisions = []

        stats.update(seconds, this)
        this.statsHistory.update(seconds)
        this.populationManager.update(seconds)

        if (this.modes.followSelection && this.selectedObjects.length) {
            let position = {
                x: 0,
                y: 0
            }
            this.selectedObjects.forEach(p => {
                position.x += p.position.x
                position.y += p.position.y
            })
            position.x /= this.selectedObjects.length
            position.y /= this.selectedObjects.length
            this.position.x = ((this.screenWidth / 2) - position.x * this.scale.x)
            this.position.y = ((this.screenHeight / 2) - position.y * this.scale.y)
        }
        if (typeof window !== 'undefined') {
            this.container.addChild(this.fxcontainer)
        }
    }

    updatePairs(root, seconds, count) {
        let pair
        // Run calculations on interactions by pairs.
        while (count-- > 0 && (pair = (root.next || (root.current = root.first)))) {

            pair.age += seconds
            if (pair.age >= pair.ageUntilUpdate) {
                if (
                    pair.particle1.mass <= 0 ||
                    pair.particle2.mass <= 0 ||
                    pair.particle1.removed ||
                    pair.particle2.removed
                ) {
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
        const combinedRadii = pair.particle1.radius + pair.particle2.radius
        if (pair.distance > (combinedRadii * performance.distanceThreshold3)) {
            if (root !== this.pairs[2]) {
                if (root) {
                    // console.log('removing pair 2 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[2].add(pair)
            }
        } else if (pair.distance > (combinedRadii * performance.distanceThreshold2)) {
            if (root !== this.pairs[1]) {
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

    previewParticle(options) {
        options      = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            parent: this
        }, options))
        this.container.addChild(particle.container)
        return particle
    }

    addParticle(particle, options) {
        if (!particle || particle.constructor !== Particle) {
            options  = particle || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            particle = new Particle(Object.assign({
                parent: this
            }, options))
        }
        this.particles.forEach(other => {
            this.updatePairLocation(new ParticlePair(particle, other))
        })
        this.particles.push(particle)
        this.add(particle)
        stats.simulation.particleCount++
        return particle
    }

    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.addParticle({
                radius  : 2 + Math.random() * 4,
                position: {
                    x: 2500 * Math.random() - 1250,
                    y: 2500 * Math.random() - 1250,
                }
            })
        }
    }

    _removeParticle(particle) {
        let index = this.particles.indexOf(particle)
        if (index >= 0) {
            this.particles.splice(index, 1)
        }
        stats.simulation.particleCount--
    }

    addGenerator(generator, options) {
        if (!generator || generator.constructor !== Generator) {
            options   = generator || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            generator = new Generator(Object.assign({
                parent: this
            }, options))
        }

        this.generators.push(generator)
        this.add(generator)
        this.addFx(generator)
        stats.simulation.generatorCount++
        return generator
    }

    removeGenerator(generator) {
        let index = this.generators.indexOf(generator)
        if (index >= 0) {
            this.generators.splice(index, 1)
        }
        this.removeFx(generator)
        stats.simulation.generatorCount--
    }

    remove(object) {
        super.remove(object)
        if (object.type === 'particle') {
            this._removeParticle(object)
        } else if (object.type === 'generator') {
            this.removeGenerator(object)
        }
    }

    removeAll() {
        let i = this.objects.length
        while(i-->0) {
            this.remove(this.objects[i])
        }
    }
}

module.exports = ParticleSandbox
