import React from 'react'
import state from './state'
import Button from './components/TextButton'

const {ps, selectionInfo} = state

export default class SelectionInfo extends React.Component {
    render() {
        setTimeout(() => this.forceUpdate(), 200)
        if (!ps || ps.selectedObjects.length === 0) return null
        const stats = this.statistics()
        return (
            <div id="selection-info">
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr>
                        <td>count:</td>
                        <td>{ps.selectedObjects.length}</td>
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
                    <tr>
                        <td>density:</td>
                        <td>{stats.averageDensity.toFixed(2)} avg</td>
                    </tr>
                    <tr>
                        <td>heat:</td>
                        <td>{stats.heat.toFixed(2)} ({stats.averageHeat.toFixed(2)} avg)</td>
                    </tr>
                    </tbody>
                </table>
                <Button onClick={selectionInfo.toggleFollowSelection}
                        selected={selectionInfo.followSelection}>Follow</Button>
            </div>
        )
    }

    statistics() {
        let count   = ps.selectedObjects.length
        const stats = {
            count,
            position      : {
                x: 0, y: 0
            },
            momentum      : {
                x: 0, y: 0
            },
            mass          : 0,
            averageMass   : 0,
            averageDensity: 0,
            heat          : 0,
            averageHeat   : 0,
        }
        for (let p of ps.selectedObjects) {
            stats.position.x += p.position.x
            stats.position.y += p.position.y
            if (p.type === 'particle') {
                stats.momentum.x += p.momentum.x
                stats.momentum.y += p.momentum.y
                stats.mass += p.mass
                stats.averageMass += p.mass
                stats.averageDensity += p.density
                stats.heat += p.heat
                stats.averageHeat += p.heat
            }
        }
        stats.position.x /= count
        stats.position.y /= count
        stats.momentum.x /= count
        stats.momentum.y /= count
        stats.averageMass /= count
        stats.averageDensity /= count
        stats.averageHeat /= count
        return stats
    }
}
