const LinkedList = require('./LinkedList')
const stats      = require('./stats')

export default class ParticlePairLinkedList extends LinkedList {
    add(node) {
        super.add(node)
        stats.simulation.particlePairCount++
    }

    remove(node) {
        super.remove(node)
        stats.simulation.particlePairCount--
    }
}
