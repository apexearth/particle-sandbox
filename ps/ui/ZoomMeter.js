import React from 'react'
import state from './state'

const zoomBarMax = 94

class ZoomMeter extends React.Component {
    componentWillMount() {
        const {ps}        = state
        ps.on('zoom', () => this.forceUpdate())
    }

    render() {
        const {ps}     = state
        return (
            <div id="zoom-meter">
                <div onClick={() => {
                    ps.zoomOut()
                    this.forceUpdate()
                }} className="zoom-meter-button">
                    <span className="glyphicon glyphicon-minus"/>
                </div>
                <div className="zoom-meter-vbar" style={{left: (ps.zoomPercentage * zoomBarMax) + "px"}}></div>
                <div className="zoom-meter-hbar"></div>
                <div onClick={() => {
                    ps.zoomIn()
                    this.forceUpdate()
                }} className="zoom-meter-button">
                    <span className="glyphicon glyphicon-plus"/>
                </div>
            </div>
        )
    }
}

module.exports = ZoomMeter
