const LinkedListNode = require('./LinkedListNode')

/**
 * I'm a linked list!
 */
class ParticlePair extends LinkedListNode {

    constructor(particle1, particle2) {
        super()

        this.particle1 = particle1
        this.particle2 = particle2
        this.update()
        this.age = 0
    }

    update() {
        this.distance       = this.particle1.distance(this.particle2)
        this.checkCollision = this.particle1.collisionRange(this.particle2, this.distance)
        this.ageUntilUpdate = this.distance / 10000
    }


}

module.exports = ParticlePair