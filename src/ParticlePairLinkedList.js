import LinkedList from './LinkedList'
import stats from './stats'

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
