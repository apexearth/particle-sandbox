import React from 'react'
import state from './state'

const zoomBarMax = 94

class ZoomMeter extends React.Component {
    componentWillMount() {
        const {ps}        = state
        ps.on('zoom', () => this.forceUpdate())
        this.setState({
            mouseUp: () => this.mouseUp()
        })
        document.addEventListener('mousewheel', event => ps.zoom += (event.deltaY < 0 ? .1 : -.1))
    }

    mouseUp(e) {
        this.state.active = false
        document.removeEventListener('mouseup', this.state.mouseUp)
    }

    mouseDown(e) {
        this.state.active = true
        if (typeof document !== 'undefined') {
            document.addEventListener('mouseup', this.state.mouseUp)
        }
        this.setZoomPercentage(e)
    }

    mouseMove(e) {
        if (this.state.active) {
            this.setZoomPercentage(e)
        }
    }

    setZoomPercentage(e) {
        const {ps}        = state
        let element       = e.target
        while (element.className !== "zoom-meter-center" && element.parentElement) element = element.parentElement
        ps.zoom = (e.clientX - element.parentNode.offsetLeft - element.offsetLeft) / element.offsetWidth
    }

    render() {
        const {ps}     = state
        return (
            <div id="zoom-meter">
                <div onClick={() => {
                    ps.zoom -= .1
                }} className="zoom-meter-button">
                    <span className="glyphicon glyphicon-minus"/>
                </div>
                <div className="zoom-meter-center"
                     onMouseMove={e => this.mouseMove(e)}
                     onMouseDown={e => this.mouseDown(e)}>
                    <div className="zoom-meter-vbar" style={{left: (ps.zoom * zoomBarMax) + "px"}}></div>
                    <div className="zoom-meter-hbar"></div>
                </div>
                <div onClick={() => {
                    ps.zoom += .1
                }} className="zoom-meter-button">
                    <span className="glyphicon glyphicon-plus"/>
                </div>
            </div>
        )
    }
}

module.exports = ZoomMeter
