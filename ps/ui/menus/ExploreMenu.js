import React from 'react'
import state from '../state'
const inputs = require('../../inputs')

const {explore} = state
class ExploreMenu extends React.Component {

    componentDidMount() {
        this.setState(explore)
        explore.subscribe(settings => this.setState(settings))
        this.setState({
            page     : 1,
            pageSize : 15,
            particles: state.ps.particles
        })
        setInterval(() => this.setState({particles: state.ps.particles}), 1000)
    }

    render() {
        if (!explore.visible())  return null
        if (!this.state) return null
        if (!this.state.particles) return null

        const buttons = this.renderButtons()
        const list    = this.renderList()
        return (
            <div id="explore-menu">
                {buttons}
                {list}
            </div>
        )
    }

    renderButtons() {
        const ps      = state.ps
        const mapping = {
            "Select All": ps => {
                ps.selectAll();
                this.forceUpdate()
            },
            "Deselect"  : ps => {
                ps.deselectAll();
                this.forceUpdate()
            },
            "Delete"    : ps => {
                ps.removeSelected();
                this.forceUpdate()
            },
        }
        const keys    = Object.keys(mapping)
        return (
            <table style={{width: "100%"}} className="gui-table">
                <thead>
                <tr>
                    {keys.map(key => (
                        <th className="button"
                            key={`header-key-${key}`}
                            onClick={() => mapping[key](ps)}
                        >
                            {key}
                        </th>)
                    )}
                </tr>
                </thead>
            </table>
        )
    }

    renderList() {
        const ps      = state.ps
        let pageCount = Math.ceil(this.state.particles.length / this.state.pageSize)

        // Ensure we're on the min or max page.
        if (this.state.page > pageCount) {
            this.state.page = pageCount
        } else if (this.state.page <= 0) {
            this.state.page = Math.min(1, pageCount)
        }

        const start     = (this.state.page - 1) * this.state.pageSize
        const end       = start + this.state.pageSize
        const particles = this.state.particles.slice(start, end)
        const mapping   = {
            "type": p => 'particle',
            "id"  : p => p.id,
            "mass": p => p.mass.toFixed(2),
            "x"   : p => p.position.x.toFixed(2),
            "y"   : p => p.position.y.toFixed(2),
            "vx"  : p => p.momentum.x.toFixed(2),
            "vy"  : p => p.momentum.y.toFixed(2),
        }
        const keys      = Object.keys(mapping)
        const header    = (
            <thead>
            <tr>
                {keys.map(key => <th key={`header-key-${key}`}>{key}</th>)}
            </tr>
            </thead>
        )
        const rows      = (
            <tbody>
            {particles.map((particle, i) => {
                    return (
                        <tr key={`body-row-${i}`}
                            onMouseDown={() => {
                                ps.selectParticle(particle, inputs('shift') || inputs('control'))
                                this.setState({particles: ps.particles})
                            }}
                            className={particle.selected ? "row-selected" : "row"}
                        >
                            {keys.map(key => {
                                let value = mapping[key](particle, i)
                                return (
                                    <td key={`body-row-${i}-${key}`}
                                        style={{textAlign: /[0-9.]+/.test(value) ? "right" : "left"}}>
                                        {value}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                }
            )}
            </tbody>
        )
        const bottom    = (
            <tfoot>
            <tr>
                <td colSpan={keys.length - 2} style={{textAlign: 'right'}}>{`${this.state.page} of ${pageCount}`}</td>
                <td className="prev" onClick={() => this.setState({page: Math.max(1, this.state.page - 1)})}>
                    prev
                </td>
                <td className="next" onClick={() => this.setState({page: Math.min(pageCount, this.state.page + 1)})}>
                    next
                </td>
            </tr>
            </tfoot>
        )
        return (
            <table className="gui-table">
                {header}
                {rows}
                {bottom}
            </table>
        )
    }
}

module.exports = ExploreMenu