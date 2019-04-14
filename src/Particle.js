import Color from 'color'
import {AppObject} from 'apex-app'
import angles from './angles'
import config from './config'
import settings from './settings'

const {simulation, view} = config

export default class Particle extends AppObject {
    constructor({app, parent, position, momentum, mass, radius, density, color}) {
        if (momentum) momentum.rotation = 0
        super({app, parent, position, momentum})
        this.type = 'particle'

        if (color) {
            color = Color(color)
            if (settings.invertColors) {
                color = color.negate()
            }
        } else {
            color = Particle.particleColor
        }

        this.color        = color
        this.density      = density || Math.max(.1, Math.random() * Math.random())
        this.density_prev = this.density
        this._heat        = 0
        this.heatEmission = 0
        if (radius) {
            this.radius = radius
        } else {
            this.mass      = mass || 4
            this.mass_prev = this.mass
        }

        this._updatePrevious()
        this.draw()
    }

    static get particleColor() {
        let colorTotal = 255 * (settings.invertColors ? 1 : 2.5)
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
        return Color.rgb(colorR, colorG, colorB)
    }

    set heat(val) {
        this._heat = Math.max(0, val)
    }

    get heat() {
        return this._heat
    }

    set density(val) {
        this.density_prev    = this._density
        this._density        = val
        this.container.alpha = Math.min(1, Math.sqrt(this.density) * 2)
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
        if (this.mass < 0) return
        if (typeof window !== 'undefined') {
            this.graphics.clear()
            this.graphics.beginFill(this.color.rgbNumber())
            if (this._selected) {
                let selectedColor = settings.fadeFilterCSS ? 0x000000 : 0xffffff
                this.graphics.lineStyle(1 / this.radius, selectedColor, 1)
            }
            this.drawHeat()
            this.graphics.drawCircle(0, 0, 1)
            this.graphics.endFill()
            this.graphics.lineStyle(0, 0xffffff, 1)
            this.updateScale()
        }
    }

    drawHeat() {
        if (this.heat < 250) return
        let heatLevel            = Math.log(this.heat) / 2
        let heatAffectingVisuals = this.heat / this.mass
        let heatColor            = this.color.darken(.05 * heatAffectingVisuals).rgbNumber()
        this.graphics.beginFill(heatColor, .15)
        while (heatLevel-- > 0) {
            this.graphics.drawCircle(0, 0, (1 + heatLevel * .05))
        }
        this.graphics.endFill()
    }

    distance(other) {
        return Math.sqrt(Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2))
    }

    collisionRange(other, distance) {
        return distance < (this.radius + other.radius) * 50
    }


    update(seconds) {
        if (this.mass <= 0) return
        this.updateHeat(seconds)
        super.update(seconds)
        this.density_prev = this.density
        this.density += seconds * Math.sqrt(this.mass) / 100000 / this.density
        if (this.mass < .25) {
            this.mass -= seconds
        }
        this.updateScale()

        if (simulation.heatRate.value) {
            this.heat += Particle.calculateSpeed(this.momentum_prev.x - this.momentum.x, this.momentum_prev.y - this.momentum.y) * simulation.heatRate.value
        }
    }

    updateScale() {
        if (!this.container.parent) {
            this.scale.x = this.scale.y = this.radius
        } else {
            // Update scale based on radius and ensure we are always at least 1 pixel large regardless of zoom.
            this.scale.x = this.scale.y = (this.radius * this.container.parent.scale.x >= view.minDrawScale.value) ? this.radius : view.minDrawScale.value / this.container.parent.scale.x
        }
    }

    updateHeat(seconds) {
        this.heat += this.mass * (this.density - this.density_prev) * seconds * simulation.heatRate.value
        this.heatEmission = this.heat
        this.heat *= 1 - ((this.heat / this.mass) * (simulation.heatRate.value / 100000) * seconds)
        this.heatEmission = (this.heatEmission - this.heat) / seconds
        if (Math.floor(this.heat / 250) !== this.heatDrawn) {
            this.heatDrawn = Math.floor(this.heat / 250)
            this.draw()
        }
    }

    /**
     * High Run Rate
     */
    updateAttract(pair) {
        if (pair.distance === 0) return
        let pull   = Math.pow(pair.distance, simulation.gravityExponent.value) / simulation.gravityStrength.value
        let {x, y} = Particle.calculateDirection(pair.particle1.position, pair.particle2.position)
        x *= pair.age
        y *= pair.age
        pair.particle1.momentum.x -= pair.particle2.mass * x / pull
        pair.particle1.momentum.y -= pair.particle2.mass * y / pull
        pair.particle2.momentum.x -= -pair.particle1.mass * x / pull
        pair.particle2.momentum.y -= -pair.particle1.mass * y / pull

        if (simulation.gravityStrength2.value) {
            let pull2 = Math.pow(pair.distance, simulation.gravityExponent2.value) / simulation.gravityStrength2.value
            pair.particle1.momentum.x -= pair.particle2.mass * x / pull2
            pair.particle1.momentum.y -= pair.particle2.mass * y / pull2
            pair.particle2.momentum.x -= -pair.particle1.mass * x / pull2
            pair.particle2.momentum.y -= -pair.particle1.mass * y / pull2
        }
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
        let averageHeat = (particle2.heat + particle1.heat) / 2
        if (particle1.density > particle2.density) {
            let transferPercentage = Math.min(1, (particle1.mass / particle2.mass) * particle2.density * amount * simulation.absorbRate.value)
            let transferAmount     = Math.min(particle2.mass, Math.max(particle2.mass * transferPercentage, 0.1))
            let heatDifference     = averageHeat - particle1.heat
            particle1.heat += heatDifference * (transferPercentage * particle2.mass) / particle1.mass
            particle1.mass += transferAmount
            particle2.mass -= transferAmount
        } else {
            let transferPercentage = Math.min(1, (particle2.mass / particle1.mass) * particle1.density * amount * simulation.absorbRate.value)
            let transferAmount     = Math.min(particle1.mass, Math.max(particle1.mass * transferPercentage, 0.1))
            let heatDifference     = averageHeat - particle2.heat
            particle2.heat += heatDifference * (transferPercentage * particle1.mass) / particle2.mass
            particle2.mass += transferAmount
            particle1.mass -= transferAmount
        }
    }

    static exchangeHeatEmission({particle1, particle2, distance, age}) {
        if (age === 0 || particle1.mass <= 0 || particle2.mass <= 0) return
        let quarter1 = Math.sqrt(particle1.radius * particle1.radius * 2)
        let quarter2 = Math.sqrt(particle2.radius * particle2.radius * 2)
        particle1.heat += particle2.heatEmission * quarter2 / (distance - particle1.radius) * age / 2
        particle2.heat += particle1.heatEmission * quarter1 / (distance - particle2.radius) * age / 2
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

        if (simulation.heatRate.value) {
            particle1.heat += Math.abs(Math.sqrt(change1x * change1x + change1y * change1y)) / 100000 * simulation.heatRate.value * particle1.mass
            particle2.heat += Math.abs(Math.sqrt(change2x * change2x + change2y * change2y)) / 100000 * simulation.heatRate.value * particle2.mass
        }

        particle1.momentum.x += change1x * ((simulation.bouncePercentage.value / 2) + .5)
        particle1.momentum.y += change1y * ((simulation.bouncePercentage.value / 2) + .5)
        particle2.momentum.x += change2x * ((simulation.bouncePercentage.value / 2) + .5)
        particle2.momentum.y += change2y * ((simulation.bouncePercentage.value / 2) + .5)
    }

}
