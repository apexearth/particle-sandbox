import React from 'react'
import {ps, selectionInfo} from './state'
import Button from './components/TextButton'

class SelectionInfo extends React.Component {
    render() {
        setTimeout(() => this.forceUpdate(), 200)
        if (!ps || ps.selectedParticles.length === 0) return null
        const stats = this.statistics()
        return (
            <div id="selection-info">
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td>count:</td>
                        <td>{ps.selectedParticles.length}</td>
                    </tr>
                    <tr>
                        <td>position:</td>
                        <td>{`${stats.position.x.toFixed(0)},${stats.position.y.toFixed(0)}`}</td>
                    </tr>
                    <tr>
                        <td>momentum:</td>
                        <td>{`${stats.momentum.x.toFixed(2)},${stats.momentum.y.toFixed(2)}`}</td>
                    </tr>
                    <tr>
                        <td>mass:</td>
                        <td>{stats.mass.toFixed(2)} ({stats.averageMass.toFixed(2)} avg)</td>
                    </tr>
                    </tbody>
                </table>
                <Button onClick={selectionInfo.toggleFollowSelection}
                        selected={selectionInfo.followSelection}>Follow</Button>
            </div>
        )
    }

    statistics() {
        let count   = ps.selectedParticles.length
        const stats = {
            count,
            position   : {
                x: 0, y: 0
            },
            momentum   : {
                x: 0, y: 0
            },
            mass       : 0,
            averageMass: 0
        }
        for (let p of ps.selectedParticles) {
            stats.position.x += p.position.x
            stats.position.y += p.position.y
            stats.momentum.x += p.momentum.x
            stats.momentum.y += p.momentum.y
            stats.mass += p.mass
            stats.averageMass += p.mass
        }
        stats.position.x /= count
        stats.position.y /= count
        stats.momentum.x /= count
        stats.momentum.y /= count
        stats.averageMass /= count
        return stats
    }
}

module.exports = SelectionInfo