const PIXI   = typeof window !== 'undefined' ? require('pixi.js') : null;
const angles = require('./angles')

class Particle {
    constructor({parent, position, momentum, mass}) {
        if (!parent) throw new Error('No parent recieved.')
        this.parent = parent
        position    = position || {x: 0, y: 0}
        momentum    = momentum || {x: 0, y: 0}

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
            this.graphics  = new PIXI.Graphics();
            this.container.addChild(this.graphics);
            this.parent.container.addChild(this.container);
        } else {
            this.container = {position: {x: 0, y: 0}, scale: {x: 1, y: 1}};
        }

        this.color      = 0xff00ff;
        this.mass       = mass || 4
        this.mass_prev  = this.mass
        this.position.x = position.x
        this.position.y = position.y
        this.momentum   = {
            x: momentum.x,
            y: momentum.y
        }
        this.updatePrevious()

        this.draw();
    }

    set radius(val) {
        this.mass = val * val * Math.PI;
    }

    get radius() {
        if (!this._radius || this.mass_prev !== this.mass) {
            this.mass_prev = this.mass;
            this._radius   = Math.sqrt(this.mass / Math.PI);
            this.scale.x   = this.scale.y = this._radius
        }
        return this._radius;
    }

    get position() {
        return this.container.position;
    }

    get scale() {
        return this.container.scale;
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear();
            this.graphics.beginFill(this.color)
            this.graphics.drawCircle(0, 0, 1);
            this.graphics.endFill();
            this.scale.x = this.scale.y = this._radius
        }
    }

    distance(other) {
        return Math.sqrt(Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2));
    }

    collisionRange(other, distance) {
        return distance < (this.radius + other.radius) * 50;
    }

    update(seconds) {
        if (this.mass <= 0) {
            this.parent.removeParticle(this)
        }
        this.updatePrevious()
    }

    updateMovement(seconds) {
        this.position.x += this.momentum.x * seconds
        this.position.y += this.momentum.y * seconds
    }

    updatePrevious() {
        this.position_prev = {
            x: this.position.x,
            y: this.position.y,
        }
        this.momentum_prev = {
            x: this.momentum.x,
            y: this.momentum.y,
        }
    }

    updateAttract(pair) {
        let pull = pair.particle1.calculatePull(pair.particle2, pair.distance)
        pair.particle1.momentum.x -= pull.other.x * pair.age
        pair.particle1.momentum.y -= pull.other.y * pair.age
        pair.particle2.momentum.x -= pull.this.x * pair.age
        pair.particle2.momentum.y -= pull.this.y * pair.age
    }

    updateCollisions(pair) {
        let collision = pair.particle1.calculateCollision(pair.particle2);
        if (collision) {
            this.parent.collisions.push(collision);
        }
    }

    calculateCollision(other) {
        let distance        = this.distance(other)
        let collideDistance = this.radius + other.radius;
        if (distance < collideDistance) {
            return {
                particle1: this,
                particle2: other
            };
        }
        return null;
    }

    calculatePull(other, distance) {
        let pull       = (distance * distance) / 100;
        let xDirection = this.position.x - other.position.x
        let yDirection = this.position.y - other.position.y
        let hyp        = Math.sqrt(1 + xDirection * xDirection + yDirection * yDirection) * pull;
        xDirection     = xDirection / hyp;
        yDirection     = yDirection / hyp;

        return {
            this : {
                x: xDirection === 0 ? 0 : -this.mass * xDirection,
                y: yDirection === 0 ? 0 : -this.mass * yDirection
            },
            other: {
                x: xDirection === 0 ? 0 : other.mass * xDirection,
                y: yDirection === 0 ? 0 : other.mass * yDirection
            }
        }
    }

    /**
     * This is not completely accurate.
     * Collision *should* happen at the action point of impact between this frame and the last frame.
     */
    uncollide(other) {
        let totalRadius    = this.radius + other.radius;
        let collisionPoint = {
            x: ((this.position.x * this.radius) + (other.position.x * other.radius)) / totalRadius,
            y: ((this.position.y * this.radius) + (other.position.y * other.radius)) / totalRadius
        }

        let angle        = angles.angle(this.position.x, this.position.y, other.position.x, other.position.y);
        this.position.x  = collisionPoint.x - Math.cos(angle) * other.radius
        this.position.y  = collisionPoint.y - Math.sin(angle) * other.radius
        other.position.x = collisionPoint.x + Math.cos(angle) * this.radius
        other.position.y = collisionPoint.y + Math.sin(angle) * this.radius
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
        let meProportion    = this.mass / (this.mass + other.mass);
        let otherProportion = 1 - meProportion;
        let xm              = this.momentum.x;
        let ym              = this.momentum.y;
        this.momentum.x     = xm * meProportion + other.momentum.x * otherProportion;
        this.momentum.y     = ym * meProportion + other.momentum.y * otherProportion;
        other.momentum.x    = this.momentum.x;
        other.momentum.y    = this.momentum.y;
    }

}

module.exports = Particle;
