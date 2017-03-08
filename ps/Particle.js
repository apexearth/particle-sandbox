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
            this.draw();
            this.container.addChild(this.graphics);
            this.parent.container.addChild(this.container);
        } else {
            this.container = {position: {x: 0, y: 0}};
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

        this.nearbyParticles     = [];
        this.distantParticles    = [];
        this.distantCheckTimeout = 0;
        this.distantCheckAge     = 0;
    }

    set radius(val) {
        this.mass = val * val * Math.PI;
    }

    get radius() {
        if (!this._radius || this.mass_prev !== this.mass) {
            this.mass_prev = this.mass;
            this._radius   = Math.sqrt(this.mass / Math.PI);
        }
        return this._radius;
    }

    get position() {
        return this.container.position;
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear();
            this.graphics.beginFill(this.color)
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
        this.position_prev = {
            x: this.position.x,
            y: this.position.y,
        }
        this.momentum_prev = {
            x: this.momentum.x,
            y: this.momentum.y,
        }
    }

    analyzePosition(other) {
        let distance = Math.sqrt(Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2));
        if (distance > (this.radius + other.radius) * 25) {
            this.distantParticles.push({
                particle: other,
                distance,
                age     : 0
            });
        } else {
            this.nearbyParticles.push({
                particle: other,
                distance,
                age     : 0
            });
        }
    }

    updateAttract(seconds) {
        if (this.nearbyParticles.length > 0) {
            this.color = 0xff00ff;
        }
        for (let i = this.nearbyParticles.length - 1; i >= 0; i--) {
            let nearby  = this.nearbyParticles[i]
            let other   = nearby.particle;
            other.color = 0xff00ff;
            if (other.mass <= 0) {
                this.nearbyParticles.splice(i, 1);
                continue;
            }

            nearby.age += seconds
            let pull = this.calculatePull(other)
            this.momentum.x -= pull.other.x * seconds
            this.momentum.y -= pull.other.y * seconds
            other.momentum.x -= pull.this.x * seconds
            other.momentum.y -= pull.this.y * seconds
            if (nearby.age > 2 * Math.random()) {
                this.nearbyParticles.splice(i, 1);
                this.analyzePosition(other);
            }
        }

        this.distantCheckAge += seconds
        if (this.distantCheckAge > this.distantCheckTimeout) {
            for (let i = this.distantParticles.length - 1; i >= 0; i--) {
                let distant = this.distantParticles[i]
                let other   = distant.particle
                if (other.mass <= 0) {
                    this.distantParticles.splice(i, 1);
                    continue;
                }
                distant.age += this.distantCheckAge

                let pull = this.calculatePull(other)
                this.momentum.x -= pull.other.x * this.distantCheckAge
                this.momentum.y -= pull.other.y * this.distantCheckAge
                other.momentum.x -= pull.this.x * this.distantCheckAge
                other.momentum.y -= pull.this.y * this.distantCheckAge

                this.distantParticles.splice(i, 1);
                this.analyzePosition(other);
            }
            this.distantCheckAge     = 0
            this.distantCheckTimeout = Math.random() * .1
        }

    }

    updateCollisions(seconds) {
        for (let i = 0; i < this.nearbyParticles.length; i++) {
            let nearby    = this.nearbyParticles[i]
            let collision = this.calculateCollision(nearby.particle);
            if (collision) {
                this.parent.collisions.push(collision);
            }
        }
    }

    calculateCollision(other) {
        let distance        = Math.sqrt(Math.pow(this.position.x - other.position.x, 2) + Math.pow(this.position.y - other.position.y, 2));
        let collideDistance = this.radius + other.radius;
        if (distance < collideDistance) {
            return {
                particle1: this,
                particle2: other
            };
        }
        return null;
    }

    calculatePull(other) {
        let constant          = 1000;
        let xDirection        = this.position.x - other.position.x
        let yDirection        = this.position.y - other.position.y
        let xDirectionSquared = 2 + xDirection * xDirection
        let yDirectionSquared = 2 + yDirection * yDirection
        let hyp               = Math.sqrt(xDirectionSquared + yDirectionSquared);
        let xDirectionWeight  = xDirection / hyp;
        let yDirectionWeight  = yDirection / hyp;
        let distance          = xDirectionSquared * yDirectionSquared;

        return {
            this : {
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
