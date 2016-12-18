var PIXI = require('pixi.js');
class Particle {
    constructor({parent, position}) {
        if (!parent) throw new Error('No parent recieved.')
        this.parent = parent
        this.mass = 100

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container();
            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(0xff00ff)
            this.graphics.drawCircle(0, 0, 2);
            this.graphics.endFill();
            this.container.addChild(this.graphics);
            this.parent.container.addChild(this.container);
        } else {
            this.container = {position: {x: 0, y: 0}};
        }

        this.position.x = position.x
        this.position.y = position.y
        this.position_prev = {x: 0, y: 0}

        this.momentum = {x: 0, y: 0}
        this.momentum_prev = {x: 0, y: 0}
    }

    get position() {
        return this.container.position;
    }

    update() {
        if (this.mass <= 0) throw new Error("Ahh! I've no mass!")
        this.updatePrevious()
    }

    updateMovement() {
        this.position.x += this.momentum.x
        this.position.y += this.momentum.y
    }

    updatePrevious() {
        this.position_prev = Object.assign({}, this.position)
        this.momentum_prev = Object.assign({}, this.momentum)
    }

    updateInteract() {
        for (var i = this.parent.particles.indexOf(this) + 1; i < this.parent.particles.length; i++) {
            var other = this.parent.particles[i]
            if (this === other) continue
            var pull = this.calculatePull(other)
            this.momentum.x -= pull.other.x
            this.momentum.y -= pull.other.y
            other.momentum.x -= pull.this.x
            other.momentum.y -= pull.this.y
        }
    }

    calculatePull(other) {
        var constant = .05;
        var xDirection = this.position.x - other.position.x
        var yDirection = this.position.y - other.position.y
        var xDirectionSquared = 2 + xDirection * xDirection
        var yDirectionSquared = 2 + yDirection * yDirection
        var hyp = Math.sqrt(xDirectionSquared + yDirectionSquared);
        var xDirectionWeight = xDirection / hyp;
        var yDirectionWeight = yDirection / hyp;
        var distance = xDirectionSquared * yDirectionSquared;

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
    };
}

module.exports = Particle;
