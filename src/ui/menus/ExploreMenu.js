import React from 'react'
import state from '../state'

const inputs = require('../../inputs')

const {explore} = state

export default class ExploreMenu extends React.Component {

    componentDidMount() {
        this.setState(explore)
        explore.subscribe(settings => this.setState(settings))
        this.setState({
            page   : 1,
            objects: state.ps.objects
        })
        setInterval(() => this.updateState(), 1000)
    }

    updateState() {
        this.setState({objects: state.ps.objects})
    }

    render() {
        if (!explore.visible()) return null
        if (!this.state) return null
        if (!this.state.objects) return null

        const buttons = this.renderButtons()
        const list    = this.renderList()
        return (
            <div id="explore-menu" className="events">
                {buttons}
                {list}
            </div>
        )
    }

    renderButtons() {
        const ps      = state.ps
        const mapping = {
            "Select All": ps => {
                ps.selectAll()
                this.forceUpdate()
            },
            "Deselect"  : ps => {
                ps.deselectAll()
                this.forceUpdate()
            },
            "Delete"    : ps => {
                ps.removeSelected()
                this.forceUpdate()
            },
        }
        const keys    = Object.keys(mapping)
        return (
            <table style={{width: "100%", height: "21px"}} className="gui-table">
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
        const ps       = state.ps
        const pageSize = Math.floor((ps.screenHeight - 150) / 20)
        let pageCount  = Math.ceil(this.state.objects.length / pageSize)

        // Ensure we're on the min or max page.
        if (this.state.page > pageCount) {
            this.setState({page: pageCount})
        } else if (this.state.page <= 0) {
            this.setState({page: Math.min(1, pageCount)})
        }

        const start   = (this.state.page - 1) * pageSize
        const end     = start + pageSize
        const objects = this.state.objects.slice(start, end)
        const mapping = {
            "type"   : p => p.type,
            "id"     : p => p.id,
            "mass"   : p => p.mass ? p.mass.toFixed(2) : 0,
            "density": p => p.density ? p.density.toFixed(2) : 0,
            "x"      : p => p.position.x.toFixed(2),
            "y"      : p => p.position.y.toFixed(2),
            "vx"     : p => p.momentum.x.toFixed(2),
            "vy"     : p => p.momentum.y.toFixed(2),
        }
        if (ps.screenWidth < 450) {
            delete mapping.id
            delete mapping.density
            delete mapping.vx
            delete mapping.vy
        }

        const keys   = Object.keys(mapping)
        const header = (
            <thead>
            <tr>
                {keys.map(key => <th key={`header-key-${key}`}>{key}</th>)}
            </tr>
            </thead>
        )
        const rows   = (
            <tbody>
            {objects.map((object, i) => {
                    return (
                        <tr key={`body-row-${i}`}
                            onMouseDown={() => {
                                ps.selectObject(object, inputs('shift') || inputs('control'))
                                this.updateState()
                            }}
                            className={object.selected ? "row-selected" : "row"}
                        >
                            {keys.map(key => {
                                let value = mapping[key](object, i)
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
        const bottom = (
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
