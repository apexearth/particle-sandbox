if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}

const _window = require('./window')

const Particle       = require('./Particle')
const ParticlePair   = require('./ParticlePair')
const LinkedList     = require('./LinkedList')
const stats          = require('./stats')
const {EventEmitter} = require('events')

const UserInput = require('./UserInput')

const zoomMin = .1
const zoomMax = 2


class ParticleSandbox extends EventEmitter {
    constructor(options) {
        super()
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
        this.container.position.x = this.screenWidth / 2
        this.container.position.y = this.screenHeight / 2

        this._userInput = new UserInput({parent: this})
        this.components = [
            this._userInput
        ]
        this.modes      = {
            followSelection: true
        }
    }

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
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

    zoomIn(amount = .1) {
        this.zoom(amount)
    }

    zoomOut(amount = .1) {
        this.zoom(-amount)
    }

    zoom(zoomSpeed) {
        zoomSpeed += 1
        const container   = this.container
        let initialScale  = container.scale.y
        container.scale.x = container.scale.y = Math.max(zoomMin, Math.min(zoomMax, initialScale * zoomSpeed))
        let changedScale = container.scale.y - initialScale
        container.position.x += (container.position.x - _window.innerWidth / 2) * changedScale / container.scale.y
        container.position.y += (container.position.y - _window.innerHeight / 2) * changedScale / container.scale.y
        this.emit('zoom')
    }

    get zoomPercentage() {
        return Math.max(0, Math.min(1, (this.container.scale.x - zoomMin) / (zoomMax - zoomMin)))
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
}

module.exports = ParticleSandbox
