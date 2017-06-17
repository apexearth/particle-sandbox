const _window = require('./window')

const {
          App
      }                      = require('apex-app')
const Generator              = require('./Generator')
const Particle               = require('./Particle')
const ParticlePair           = require('./ParticlePair')
const ParticlePairLinkedList = require('./ParticlePairLinkedList')
const stats                  = require('./stats')
const {performance}          = require('./config')

const UserInput = require('./UserInput')
const {
          view,
          simulation
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

        this._paused    = false
        this._userInput = new UserInput({parent: this})
        this.modes      = {
            followSelection: true
        }
    }

    get stats() {
        return stats
    }

    get userInput() {
        return this._userInput
    }

    update(seconds) {
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
                collision.particle1.bounce(collision.particle2)
                collision.particle1.uncollide(collision.particle2)
                collision.pair.previouslyCollided = true
            }
        })
        this.particles.forEach(particle => {
            if (particle.mass <= 0) {
                this.removeParticle(particle)
            }
        })
        this.collisions = []

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

    updateZoom(seconds) {
        if (Math.abs(this.scale.x - this.targetScale.x) > .01) {
            let amount   = (this.targetScale.x - this.scale.x) * seconds * 10
            this.scale.x = this.scale.y += amount
            this.position.x += (this.position.x - _window.innerWidth / 2) * amount / (this.scale.x - amount)
            this.position.y += (this.position.y - _window.innerHeight / 2) * amount / (this.scale.y - amount)
            this.emit('zoom')
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

    cancelPreview(particle) {
        this.container.removeChild(particle.container)
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
        this.addObject(particle)
        stats.simulation.particleCount++
        return particle
    }

    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.addParticle({
                mass    : 20 + Math.random() * 10,
                position: {
                    x: 2500 * Math.random() - 1250,
                    y: 2500 * Math.random() - 1250,
                }
            })
        }
    }

    removeParticle(particle) {
        let index = this.particles.indexOf(particle)
        if (index >= 0) {
            this.particles.splice(index, 1)
        }
        this.removeObject(particle)
        stats.simulation.particleCount--
    }

    addGenerator(generator, options) {
        if (!generator || generator.constructor !== Particle) {
            options   = generator || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            generator = new Generator(Object.assign({
                parent: this
            }, options))
        }

        this.generators.push(generator)
        this.addObject(generator)
        this.addFxObject(generator)
        stats.simulation.generatorCount++
        return generator
    }

    removeGenerator(generator) {
        let index = this.generators.indexOf(generator)
        if (index >= 0) {
            this.generators.splice(index, 1)
        }
        this.removeObject(generator)
        this.removeFxObject(generator)
        stats.simulation.generatorCount--
    }

    removeSelected() {
        this.removeObjects(this.selectedObjects)
    }

    removeObjects(objects) {
        let i = objects.length
        while (i--) {
            let object = objects [i]
            if (object.type === 'particle') {
                this.removeParticle(object)
            } else if (object.type === 'generator') {
                this.removeGenerator(object)
            }
            this.removeObject(object)
        }
    }

    addObject(object) {
        object.removed = false
        this.objects.push(object)
        if (typeof window !== 'undefined') {
            this.container.addChild(object.container)
        }
    }

    removeObject(object) {
        object.removed = true
        if (object.selected) {
            object.deselect()
            let index = this.selectedObjects.indexOf(object)
            if (index >= 0) {
                this.selectedObjects.splice(index, 1)
            }
        }
        let index = this.objects.indexOf(object)
        if (index >= 0) {
            this.objects.splice(index, 1)
        }
        if (typeof window !== 'undefined') {
            this.container.removeChild(object.container)
        }
    }

    addFxObject(object) {
        object.removed = false
        if (typeof window !== 'undefined') {
            this.fxcontainer.addChild(object.container)
        }
    }

    removeFxObject(object) {
        object.removed = true
        if (typeof window !== 'undefined') {
            this.fxcontainer.removeChild(object.container)
        }
    }

    get zoom() {
        return Math.max(0, Math.min(1, (this.targetScale.x - view.zoomMin) / (view.zoomMax - view.zoomMin)))
    }

    set zoom(val) {
        this.targetScale.x = this.targetScale.y = Math.max(view.zoomMin, Math.min(view.zoomMax, view.zoomMin + val * (view.zoomMax - view.zoomMin)))
    }

    selectObject(object, additive = false) {
        if (!additive) {
            this.deselectAll()
        }
        if (!object.selected) {
            object.select()
            this.selectedObjects.push(object)
        }
    }

    select(x1, y1, x2, y2, additive = false) {
        let minX = Math.min(x1, x2)
        let minY = Math.min(y1, y2)
        let maxX = Math.max(x1, x2)
        let maxY = Math.max(y1, y2)
        minX     = (minX - this.position.x) / this.scale.x
        minY     = (minY - this.position.y) / this.scale.y
        maxX     = (maxX - this.position.x) / this.scale.x
        maxY     = (maxY - this.position.y) / this.scale.y
        if (!additive) {
            this.selectedObjects.splice(0)
        }
        this.objects.forEach(object => {
            if (object.selectionHitTest(minX, minY, maxX, maxY)) {
                object.select()
                this.selectedObjects.push(object)
            } else if (!additive) {
                if (object.selected) {
                    object.deselect()
                    let index = this.selectedObjects.indexOf(object)
                    if (index >= 0) {
                        this.selectedObjects.splice(index, 1)
                    }
                }
            }
        })
    }

    selectAll() {
        if (this.objects.length === this.selectedObjects.length) return
        let i = this.objects.length
        while (i--) {
            this.selectObject(this.objects[i], true)
        }
    }

    deselectAll() {
        while (this.selectedObjects.length >= 1) {
            this.selectedObjects.pop().deselect()
        }
    }
}

module.exports = ParticleSandbox
