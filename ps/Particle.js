const angles        = require('./angles')
const Color         = require('color')
const SandboxObject = require('./SandboxObject')
const {simulation} = require('./config')

let id = 0

class Particle extends SandboxObject {
    constructor({parent, position, momentum, mass, radius}) {
        super({parent, position})
        this.id     = id++
        momentum    = momentum || {x: 0, y: 0}

        this.color     = Color.rgb(50 + Math.random() * 200, 50 + Math.random() * 200, 50 + Math.random() * 200).rgbNumber()
        if (radius) {
            this.radius = radius
        } else {
            this.mass      = mass || 4
            this.mass_prev = this.mass
        }
        this.momentum      = {
            x: momentum.x,
            y: momentum.y
        }
        this.position_prev = {}
        this.momentum_prev = {}
        this.updatePrevious()
        this.draw()
    }


    set radius(val) {
        this.mass = val * val * Math.PI
    }

    get radius() {
        if (!this._radius || this.mass_prev !== this.mass) {
            this.mass_prev = this.mass
            this._radius   = Math.sqrt(this.mass / Math.PI)
            this.scale.x   = this.scale.y = this._radius
        }
        return this._radius
    }

    get speed() {
        return Math.sqrt(this.momentum.x * this.momentum.x + this.momentum.y * this.momentum.y)
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear()
            this.graphics.beginFill(this._selected ? 0xffffff : this.color)
            this.graphics.drawCircle(0, 0, 1)
            this.graphics.endFill()
            this.scale.x = this.scale.y = this.radius
        }
    }

    distance(other) {
        return Math.sqrt(Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2))
    }

    collisionRange(other, distance) {
        return distance < (this.radius + other.radius) * 50
    }


    update(seconds) {
        this.updatePrevious()
    }

    updateMovement(seconds) {
        this.position.x += this.momentum.x * seconds
        this.position.y += this.momentum.y * seconds
    }

    updatePrevious() {
        this.position_prev.x = this.position.x
        this.position_prev.y = this.position.y
        this.momentum_prev.x = this.momentum.x
        this.momentum_prev.y = this.momentum.y
    }

    /**
     * High Run Rate
     */
    updateAttract(pair) {
        if (pair.distance === 0) return
        let pull     = Math.pow(pair.distance, simulation.gravityExponent) / simulation.gravityStrength
        let {x, y}   = Particle.calculateDirection(pair.particle1.position, pair.particle2.position)
        pair.particle1.momentum.x -= pair.particle2.mass * x / pull * pair.age
        pair.particle1.momentum.y -= pair.particle2.mass * y / pull * pair.age
        pair.particle2.momentum.x -= -pair.particle1.mass * x / pull * pair.age
        pair.particle2.momentum.y -= -pair.particle1.mass * y / pull * pair.age
    }

    updateCollisions(pair) {
        let collision = pair.particle1.calculateCollision(pair)
        pair.collided = !!collision
        if (collision) {
            this.parent.collisions.push(collision)
        }
    }

    calculateCollision(pair) {
        let distance      = pair.particle1.distance(pair.particle2)
        let combinedRadii = pair.particle1.radius + pair.particle2.radius
        if (distance < combinedRadii) {
            return {
                distance,
                combinedRadii,
                pair,
                particle1: pair.particle1,
                particle2: pair.particle2
            }
        }
        return null
    }

    static calculateAngle(pos1, pos2) {
        return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
    }

    static calculateSpeed(x, y) {
        return Math.sqrt(x * x + y * y)
    }

    static calculateDirection(pos1, pos2) {
        let xDirection = pos1.x - pos2.x
        let yDirection = pos1.y - pos2.y
        let hyp        = Particle.calculateSpeed(xDirection, yDirection)
        if (hyp === 0) {
            return {x: 0, y: 0}
        }
        xDirection = xDirection / hyp
        yDirection = yDirection / hyp
        return {
            x: xDirection,
            y: yDirection
        }
    }

    /**
     * This is not completely accurate.
     * Collision *should* happen at the action point of impact between this frame and the last frame.
     */
    uncollide(other) {
        let totalRadius     = this.radius + other.radius
        let collisionPointX = ((this.position.x * this.radius) + (other.position.x * other.radius)) / totalRadius
        let collisionPointY = ((this.position.y * this.radius) + (other.position.y * other.radius)) / totalRadius

        let angle        = angles.angle(this.position.x, this.position.y, other.position.x, other.position.y)
        this.position.x  = collisionPointX - Math.cos(angle) * other.radius
        this.position.y  = collisionPointY - Math.sin(angle) * other.radius
        other.position.x = collisionPointX + Math.cos(angle) * this.radius
        other.position.y = collisionPointY + Math.sin(angle) * this.radius
    }

    static exchangeMass({particle1, particle2}) {
        if (particle1.mass > particle2.mass) {
            let transferAmount = Math.min(particle2.mass, Math.max(particle2.mass * (particle1.mass / particle2.mass) / 100, 0.1))
            particle1.mass += transferAmount
            particle2.mass -= transferAmount
        } else {
            let transferAmount = Math.min(particle1.mass, Math.max(particle1.mass * (particle2.mass / particle1.mass) / 100, 0.1))
            particle1.mass -= transferAmount
            particle2.mass += transferAmount
        }
    }

    distributeVelocity(other, percentage = 1) {
        let meProportion    = this.mass / (this.mass + other.mass)
        let otherProportion = 1 - meProportion
        let xm              = this.momentum.x
        let ym              = this.momentum.y
        this.momentum.x     = xm * meProportion + (other.momentum.x * otherProportion) * percentage
        this.momentum.y     = ym * meProportion + (other.momentum.y * otherProportion) * percentage
        other.momentum.x    = other.momentum.x * otherProportion + (xm * meProportion) * percentage
        other.momentum.y    = other.momentum.y * otherProportion + (ym * meProportion) * percentage
    }

    // TODO: Look through this again, might have some small bugs in it.
    // https://en.wikipedia.org/wiki/Elastic_collision#Two-_and_three-dimensional
    bounce(other) {
        let totalMass = this.mass + other.mass

        let a1 = Particle.calculateAngle({x: 0, y: 0}, this.momentum)
        let m1 = this.mass
        let v1 = Particle.calculateSpeed(this.momentum.x, this.momentum.y)

        let a2 = Particle.calculateAngle({x: 0, y: 0}, other.momentum)
        let m2 = other.mass
        let v2 = Particle.calculateSpeed(other.momentum.x, other.momentum.y)

        let contactAngle = Particle.calculateAngle(this.position, other.position)

        const calcX = (a1, m1, v1, a2, m2, v2) => {
            return ((v1 * Math.cos(a1 - contactAngle) * (m1 - m2) + (2 * m2 * v2 * Math.cos(a2 - contactAngle))) / totalMass)
                * Math.cos(contactAngle)
                + (v1 * Math.sin(a1 - contactAngle) * Math.cos(contactAngle + Math.PI / 2))
        }
        const calcY = (a1, m1, v1, a2, m2, v2) => {
            return ((v1 * Math.cos(a1 - contactAngle) * (m1 - m2) + (2 * m2 * v2 * Math.cos(a2 - contactAngle))) / totalMass)
                * Math.sin(contactAngle)
                + (v1 * Math.sin(a1 - contactAngle) * Math.sin(contactAngle + Math.PI / 2))
        }

        let v1x = calcX(a1, m1, v1, a2, m2, v2)
        let v1y = calcY(a1, m1, v1, a2, m2, v2)
        let v2x = calcX(a2, m2, v2, a1, m1, v1)
        let v2y = calcY(a2, m2, v2, a1, m1, v1)

        this.momentum.x  = v1x
        this.momentum.y  = v1y
        other.momentum.x = v2x
        other.momentum.y = v2y
    }

}

module.exports = Particle
