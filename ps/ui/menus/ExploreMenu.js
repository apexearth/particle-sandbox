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
        if (!this.state.particles) return null

        let ps        = state.ps
        let pageCount = Math.ceil(this.state.particles.length / this.state.pageSize)

        if (this.state.page > pageCount) {
            this.state.page = pageCount
        }

        let start     = (this.state.page - 1) * this.state.pageSize
        let end       = start + this.state.pageSize
        let particles = this.state.particles.slice(start, end)
        let mapping   = {
            "id"  : p => p.id,
            "Mass": p => p.mass.toFixed(2),
            "x"   : p => p.position.x.toFixed(2),
            "y"   : p => p.position.y.toFixed(2),
            "vx"  : p => p.momentum.x.toFixed(2),
            "vy"  : p => p.momentum.y.toFixed(2),
        }
        let header    = (
            <thead>
            <tr>
                {Object.keys(mapping).map(key => <th key={`header-key-${key}`}>{key}</th>)}
            </tr>
            </thead>
        )
        let rows      = (
            <tbody>
            {particles.map((particle, i) => {
                    return (
                        <tr key={`body-row-${i}`}
                            onMouseDown={() => {
                                ps.selectParticle(particle, inputs('shift') || inputs('control'))
                                this.setState({
                                    particles: ps.particles
                                })
                            }}
                            className={particle.selected ? "row-selected" : "row"}
                        >
                            {Object.keys(mapping).map(key => {
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
        let bottom    = (
            <tfoot>
            <tr>
                <td colSpan="4" style={{textAlign: 'right'}}>{`${this.state.page} of ${pageCount}`}</td>
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
            <div className="gui-list">
                <table className="gui-table">
                    {header}
                    {rows}
                    {bottom}
                </table>
            </div>
        )
    }

}

module.exports = ExploreMenu