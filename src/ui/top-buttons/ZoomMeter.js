import React from 'react'
import state from '../state'

export default class ZoomMeter extends React.Component {
    componentWillMount() {
        const {ps} = state
        ps.on('zoom', () => this.forceUpdate())
        document.addEventListener('wheel', event => (event.deltaY < 0 ? ps.zoom *= 1.1 : ps.zoom /= 1.1))
    }

    render() {
        const {ps} = state
        return (
            <div id="zoom-buttons">
                <div onClick={() => {
                    ps.zoom /= 1.25
                }} className="square-button">
                    <span className="glyphicon glyphicon-minus"/>
                </div>
                <div className="rectangle-text">
                    {ps.zoom.toFixed(2)}x
                </div>
                <div onClick={() => {
                    ps.zoom *= 1.25
                }} className="square-button">
                    <span className="glyphicon glyphicon-plus"/>
                </div>
            </div>
        )
    }
}
