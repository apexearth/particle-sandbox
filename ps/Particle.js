const PIXI = typeof window !== 'undefined' ? require('pixi.js') : null;
const angles = require('./angles')

class Particle {
    constructor({parent, position, momentum, mass}) {
        if (!parent) throw new Error('No parent recieved.')
        position = position || {x: 0, y: 0}
        momentum = momentum || {x: 0, y: 0}

        this.parent = parent
        this.mass = mass || 4

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
            this.graphics = new PIXI.Graphics();
            this.draw();
            this.container.addChild(this.graphics);
            this.parent.container.addChild(this.container);
        } else {
            this.container = {position: {x: 0, y: 0}};
        }

        this.position.x = position.x
        this.position.y = position.y
        this.position_prev = {x: position.x, y: position.y}

        this.momentum = {
            x: momentum.x,
            y: momentum.y
        }
        this.momentum_prev = {
            x: momentum.x,
            y: momentum.y
        }
    }

    get radius() {
        return Math.sqrt(this.mass);
    }

    get position() {
        return this.container.position;
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear();
            this.graphics.beginFill(0xff00ff)
            this.graphics.drawCircle(0, 0, this.radius);
            this.graphics.endFill();
        }
    }

    update(seconds) {
        if (this.mass <= 0) {
            this.parent.removeParticle(this)
        }
        this.updatePrevious()
        this.draw()
    }

    updateMovement(seconds) {
        this.position.x += this.momentum.x * seconds
        this.position.y += this.momentum.y * seconds
    }

    updatePrevious() {
        this.position_prev = Object.assign({}, this.position)
        this.momentum_prev = Object.assign({}, this.momentum)
    }

    updateInteract(seconds) {
        for (let i = this.parent.particles.indexOf(this) + 1; i < this.parent.particles.length; i++) {
            let other = this.parent.particles[i]
            if (this === other) continue
            let pull = this.calculatePull(other)
            this.momentum.x -= pull.other.x * seconds
            this.momentum.y -= pull.other.y * seconds
            other.momentum.x -= pull.this.x * seconds
            other.momentum.y -= pull.this.y * seconds

            let distance = Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2);
            let collideDistance = Math.pow(this.radius + other.radius, 2);
            if (distance < collideDistance) {
                this.parent.collisions.push({
                    particle1: this,
                    particle2: other
                })
            }
        }
    }

    calculatePull(other) {
        let constant = 100;
        let xDirection = this.position.x - other.position.x
        let yDirection = this.position.y - other.position.y
        let xDirectionSquared = 2 + xDirection * xDirection
        let yDirectionSquared = 2 + yDirection * yDirection
        let hyp = Math.sqrt(xDirectionSquared + yDirectionSquared);
        let xDirectionWeight = xDirection / hyp;
        let yDirectionWeight = yDirection / hyp;
        let distance = xDirectionSquared * yDirectionSquared;

        return {
            this: {
                x: distance === 0 ? 0 : -this.mass / distance * constant * xDirectionWeight,
                y: distance === 0 ? 0 : -this.mass / distance * constant * yDirectionWeight
            },
            other: {
                x: distance === 0 ? 0 : other.mass / distance * constant * xDirectionWeight,
                y: distance === 0 ? 0 : other.mass / distance * constant * yDirectionWeight
            }
        }
    }

    /**
     * This is not completely accurate.
     * @param other
     */
    uncollide(other) {
        let centerPoint = {
            x: (this.position.x + other.position.x) / 2,
            y: (this.position.y + other.position.y) / 2
        }
        let angle = angles.angle(this.position.x, this.position.y, other.position.x, other.position.y);
        this.position.x = centerPoint.x - Math.cos(angle) * this.radius
        this.position.y = centerPoint.y - Math.sin(angle) * this.radius
        other.position.x = centerPoint.x + Math.cos(angle) * other.radius
        other.position.y = centerPoint.y + Math.sin(angle) * other.radius
    }

    exchangeMass(other) {
        let transferAmount;
        if (this.mass === other.mass) {
            // We're the same! :-o
        } else if (this.mass > other.mass) {
            transferAmount = Math.min(other.mass, Math.max(other.mass * (this.mass / other.mass) / 100, 0.1));
            this.mass += transferAmount;
            other.mass -= transferAmount;
        } else {
            transferAmount = Math.min(this.mass, Math.max(this.mass * (other.mass / this.mass) / 100, 0.1));
            this.mass -= transferAmount;
            other.mass += transferAmount;
        }
    }

    // TODO: Base me off of the angle, so things bounce.
    distributeVelocity(other) {
        let otherProportion = this.mass / (this.mass + other.mass);
        let meProportion = 1 - otherProportion;
        let xm = this.momentum.x;
        let ym = this.momentum.y;
        this.momentum.x = xm * (1 - meProportion) + other.momentum.x * meProportion;
        this.momentum.y = ym * (1 - meProportion) + other.momentum.y * meProportion;
        other.momentum.x = other.momentum.x * (1 - otherProportion) + xm * otherProportion;
        other.momentum.y = other.momentum.y * (1 - otherProportion) + ym * otherProportion;
    }

}

module.exports = Particle;
