import LinkedListNode from './LinkedListNode'
import Particle from './Particle'

/**
 * I'm a linked list!
 */
export default class ParticlePair extends LinkedListNode {

    constructor(particle1, particle2) {
        super()

        this.particle1 = particle1
        this.particle2 = particle2
        this.age       = 0
        this.distance  = particle1.distance(particle2)
        this.update()
    }

    update() {
        this.distance       = this.particle1.distance(this.particle2)
        this.checkCollision = this.particle1.collisionRange(this.particle2, this.distance)
        Particle.exchangeHeatEmission({
            particle1: this.particle1,
            particle2: this.particle2,
            age      : this.age,
            distance : this.distance,
        })
        this.ageUntilUpdate = this.distance / 10000
    }


}
