if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}

const _window = require('./window')

const Generator              = require('./Generator')
const Particle               = require('./Particle')
const ParticlePair           = require('./ParticlePair')
const ParticlePairLinkedList = require('./ParticlePairLinkedList')
const stats                  = require('./stats')
const {EventEmitter}         = require('events')

const UserInput = require('./UserInput')
const {
          view,
          simulation
      }         = require('./config')


class ParticleSandbox extends EventEmitter {
    constructor(options) {
        super()
        this.options           = Object.assign(this.defaultOptions, options)
        this.objects           = []
        this.particles         = []
        this.selectedParticles = []
        this.pairs             = [
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
        ]
        this.collisions        = []
        this.generators        = []
        if (typeof window !== 'undefined') {
            this.root      = new PIXI.Container()
            this.container = new PIXI.Container()
            this.root.addChild(this.container)
            this.fxcontainer = new PIXI.Container()
            this.container.addChild(this.fxcontainer)
        } else {
            this.container = {position: {x: 0, y: 0}, scale: {x: 1, y: 1}}
        }
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

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
    }

    get targetScale() {
        return this._targetScale || (this._targetScale = {x: this.scale.x, y: this.scale.y})
    }

    get paused() {
        return this._paused
    }

    set paused(val) {
        this._paused = val
        if (this._paused) this.emit('pause', this)
        else if (!this._paused) this.emit('play', this)
    }

    get userInput() {
        return this._userInput
    }

    get defaultOptions() {
        return {}
    }

    get screenWidth() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    get screenHeight() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }

    translatePosition(position) {
        return {
            x: (position.x - this.position.x) / this.scale.x,
            y: (position.y - this.position.y) / this.scale.y
        }
    }

    togglePause() {
        this.paused = !this.paused
    }

    update(seconds) {
        this._userInput.update(seconds)

        this.updateZoom(seconds)

        if (this.paused) return

        this.updatePairs(this.pairs[0], seconds, this.pairs[0].count)
        this.updatePairs(this.pairs[1], seconds, this.pairs[1].count * .25)
        this.updatePairs(this.pairs[2], seconds, this.pairs[2].count * .1)
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
        this.particles.forEach(particle => {
            if (particle.mass <= 0) {
                this.removeParticle(particle)
            }
        })
        this.particles.forEach(particle => particle.update(seconds))
        this.collisions = []

        if (this.modes.followSelection && this.selectedParticles.length) {
            let position = {
                x: 0,
                y: 0
            }
            this.selectedParticles.forEach(p => {
                position.x += p.position.x
                position.y += p.position.y
            })
            position.x /= this.selectedParticles.length
            position.y /= this.selectedParticles.length
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
        if (pair.distance > (combinedRadii * 75)) {
            if (root !== this.pairs[2]) {
                if (root) {
                    // console.log('removing pair 2 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[2].add(pair)
            }
        } else if (pair.distance > (combinedRadii * 25)) {
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
        this.addObject(particle)
        return particle
    }

    cancelPreview(particle) {
        this.container.removeChild(particle.container)
    }

    removeSelected() {
        this.removeSelectedParticles()
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

    removeParticles(particles) {
        let i = particles.length
        while (i--) {
            this.removeParticle(particles[i])
        }
    }

    removeParticle(particle) {
        let index = this.particles.indexOf(particle)
        if (index >= 0) {
            this.particles.splice(index, 1)
        }
        if (particle.selected) {
            particle.deselect()
            let index = this.selectedParticles.indexOf(particle)
            if (index >= 0) {
                this.selectedParticles.splice(index, 1)
            }
        }
        this.removeObject(particle)
        stats.simulation.particleCount--
    }

    removeSelectedParticles() {
        this.removeParticles(this.selectedParticles)
    }

    addGenerator(generator, options) {
        if (!generator || generator.constructor !== Particle) {
            options   = generator || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            generator = new Generator(Object.assign({
                parent: this
            }, options))
        }

        this.generators.push(generator)
        this.addFxObject(generator)
        stats.simulation.generatorCount++
        return generator
    }

    removeGenerator(generator) {
        let index = this.generators.indexOf(generator)
        if (index >= 0) {
            this.generators.splice(index, 1)
        }
        this.removeFxObject(generator)
        stats.simulation.generatorCount--
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
        let index      = this.objects.indexOf(object)
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

    selectParticle(particle, additive = false) {
        if (!additive) {
            this.deselectAll()
        }
        if (!particle.selected) {
            particle.select()
            this.selectedParticles.push(particle)
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

    selectAll() {
        if (this.particles.length === this.selectedParticles.length) return
        let i = this.particles.length
        while (i--) {
            this.selectParticle(this.particles[i], true)
        }
    }

    deselectAll() {
        while (this.selectedParticles.length >= 1) {
            this.selectedParticles.pop().deselect()
        }
    }
}

module.exports = ParticleSandbox
