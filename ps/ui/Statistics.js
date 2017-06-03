import React from 'react'
import state from './state'

module.exports = class Statistics extends React.Component {
    render() {
        setTimeout(() => this.forceUpdate(), 1000)
        let stats      = state.ps.stats
        let simulation = stats.simulation

        return (
            <div id="statistics">
                <div>Particles</div>
                <div>{simulation.particleCount}</div>
                <div>Pairs</div>
                <div>{simulation.particlePairCount}</div>
                <div>Generators</div>
                <div>{simulation.generatorCount}</div>
            </div>
        )
    }
}
