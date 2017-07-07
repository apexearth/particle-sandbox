const LinkedListNode = require('./LinkedListNode')
const Particle       = require('./Particle')

/**
 * I'm a linked list!
 */
class ParticlePair extends LinkedListNode {

    constructor(particle1, particle2) {
        super()

        this.particle1 = particle1
        this.particle2 = particle2
        this.age       = 0
        this.update()
    }

    update() {
        this.distance       = this.particle1.distance(this.particle2)
        this.checkCollision = this.particle1.collisionRange(this.particle2, this.distance)
        Particle.exchangeHeatEmission(this)
        this.ageUntilUpdate = this.distance / 10000
    }


}

module.exports = ParticlePair