const Color        = require('color')
const {AppObject}  = require('apex-app')
const angles       = require('./angles')
const {simulation} = require('./config')
const stats        = require('./stats')

class Particle extends AppObject {
    constructor({parent, position, momentum, mass, radius, density}) {
        super({parent, position, momentum})
        this.type = 'particle'

        this.color   = Particle.particleColor
        this.density = density || Math.max(.1, Math.random() * Math.random())
        if (radius) {
            this.radius = radius
        } else {
            this.mass      = mass || 4
            this.mass_prev = this.mass
        }

        this.updatePrevious()
        this.draw()
    }

    static get particleColor() {
        let colorTotal = 255 * 2.5
        let colorR     = Math.min(255, Math.random() * colorTotal)
        colorTotal -= colorR
        let colorG     = Math.min(255, Math.random() * colorTotal)
        colorTotal -= colorG
        let colorB     = Math.min(255, Math.random() * colorTotal)
        if (Math.random() > .5) {
            let temp = colorR
            colorR   = colorB
            colorB   = temp
        }
        return Color.rgb(colorR, colorG, colorB).rgbNumber()
    }

    set density(val) {
        this.density_prev    = this._density
        this._density        = val
        this.container.alpha = Math.sqrt(this.density)
    }

    get density() {
        return this._density
    }

    set radius(val) {
        this.mass = val * val * Math.PI * this.density
    }

    get radius() {
        if (!this._radius || this.mass_prev !== this.mass || this.density_prev !== this.density) {
            this.mass_prev = this.mass
            this._radius   = Math.sqrt(this.mass / Math.PI / this.density)
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
        super.update(seconds)
        if (this.density < 1) {
            this.density += this.density * seconds * this.mass / 100000
        }
        if (this.mass <= 1) {
            this.mass -= seconds
        }
    }

    updateStats(seconds) {
        stats.simulation.centerMass.x += this.position.x * this.mass
        stats.simulation.centerMass.x += this.position.y * this.mass
        stats.simulation.totalMass += this.mass
    }

    /**
     * High Run Rate
     */
    updateAttract(pair) {
        if (pair.distance === 0) return
        let pull   = Math.pow(pair.distance, simulation.gravityExponent) / simulation.gravityStrength
        let {x, y} = Particle.calculateDirection(pair.particle1.position, pair.particle2.position)
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
        let x             = ((pair.particle1.position.x * pair.particle1.radius) + (pair.particle2.position.x * pair.particle2.radius)) / combinedRadii
        let y             = ((pair.particle1.position.y * pair.particle1.radius) + (pair.particle2.position.y * pair.particle2.radius)) / combinedRadii
        let angle         = angles.angle(pair.particle1.position.x, pair.particle1.position.y, pair.particle2.position.x, pair.particle2.position.y)
        if (distance < combinedRadii) {
            return {
                position : {x, y},
                angle,
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
    static uncollide({particle1, particle2, angle}) {
        angle = angle || angles.angle(particle1.position.x, particle1.position.y, particle2.position.x, particle2.position.y)
        if (particle1.mass > particle2.mass) {
            particle2.position.x = particle1.position.x + Math.cos(angle) * (particle1.radius + particle2.radius)
            particle2.position.y = particle1.position.y + Math.sin(angle) * (particle1.radius + particle2.radius)
        } else {
            particle1.position.x = particle2.position.x - Math.cos(angle) * (particle1.radius + particle2.radius)
            particle1.position.y = particle2.position.y - Math.sin(angle) * (particle1.radius + particle2.radius)
        }
    }

    static exchangeMass({particle1, particle2}, amount = 1) {
        if (particle1.density > particle2.density) {
            let transferPercentage = (particle1.mass / particle2.mass) * particle2.density * amount * simulation.absorbRate
            let transferAmount     = Math.min(particle2.mass, Math.max(particle2.mass * transferPercentage, 0.1))
            particle1.mass += transferAmount
            particle2.mass -= transferAmount
        } else {
            let transferPercentage = (particle2.mass / particle1.mass) * particle1.density * amount * simulation.absorbRate
            let transferAmount     = Math.min(particle1.mass, Math.max(particle1.mass * transferPercentage, 0.1))
            particle1.mass -= transferAmount
            particle2.mass += transferAmount
        }
    }

    distributeVelocity(other, percentage = 1) {
        if (percentage === 0) return
        let xm              = this.momentum.x
        let ym              = this.momentum.y
        let meProportion    = this.mass / (this.mass + other.mass * percentage)
        this.momentum.x     = this.momentum.x * meProportion + (other.momentum.x * (1 - meProportion))
        this.momentum.y     = this.momentum.y * meProportion + (other.momentum.y * (1 - meProportion))
        let otherProportion = other.mass / (other.mass + this.mass * percentage)
        other.momentum.x    = other.momentum.x * otherProportion + (xm * (1 - otherProportion))
        other.momentum.y    = other.momentum.y * otherProportion + (ym * (1 - otherProportion))
    }

    // TODO: Look through this again, might have some small bugs in it.
    // https://en.wikipedia.org/wiki/Elastic_collision#Two-_and_three-dimensional
    static bounce({particle1, particle2}) {
        let totalMass = particle1.mass + particle2.mass

        let a1 = Particle.calculateAngle({x: 0, y: 0}, particle1.momentum)
        let m1 = particle1.mass
        let v1 = Particle.calculateSpeed(particle1.momentum.x, particle1.momentum.y)

        let a2 = Particle.calculateAngle({x: 0, y: 0}, particle2.momentum)
        let m2 = particle2.mass
        let v2 = Particle.calculateSpeed(particle2.momentum.x, particle2.momentum.y)

        let contactAngle = Particle.calculateAngle(particle1.position, particle2.position)

        const calcX = (a1, m1, v1, a2, m2, v2) => {
            return ((v1 * Math.cos(a1 - contactAngle) * (m1 - m2) +
                (2 * m2 * v2 * Math.cos(a2 - contactAngle))) / totalMass) * Math.cos(contactAngle) +
                (v1 * Math.sin(a1 - contactAngle) * Math.cos(contactAngle + Math.PI / 2))
        }
        const calcY = (a1, m1, v1, a2, m2, v2) => {
            return ((v1 * Math.cos(a1 - contactAngle) * (m1 - m2) +
                (2 * m2 * v2 * Math.cos(a2 - contactAngle))) / totalMass) * Math.sin(contactAngle) +
                (v1 * Math.sin(a1 - contactAngle) * Math.sin(contactAngle + Math.PI / 2))
        }

        let v1x = calcX(a1, m1, v1, a2, m2, v2)
        let v1y = calcY(a1, m1, v1, a2, m2, v2)
        let v2x = calcX(a2, m2, v2, a1, m1, v1)
        let v2y = calcY(a2, m2, v2, a1, m1, v1)


        let change1x = (v1x - particle1.momentum.x)
        let change1y = (v1y - particle1.momentum.y)
        let change2x = (v2x - particle2.momentum.x)
        let change2y = (v2y - particle2.momentum.y)

        particle1.momentum.x += change1x * ((simulation.bouncePercentage / 2) + .5)
        particle1.momentum.y += change1y * ((simulation.bouncePercentage / 2) + .5)
        particle2.momentum.x += change2x * ((simulation.bouncePercentage / 2) + .5)
        particle2.momentum.y += change2y * ((simulation.bouncePercentage / 2) + .5)
    }

}

module.exports = Particle
