import React from 'react'
import state from '../state'

export default class PlayPauseButton extends React.Component {

    componentDidMount() {
        const {ps} = state
        ps.on('pause', () => this.forceUpdate())
        ps.on('play', () => this.forceUpdate())
    }

    render() {
        const {ps} = state
        if (!ps) return null
        return (
            <div className="square-button" onClick={() => ps.togglePause()}>
                {
                    ps.paused
                        ? <span className="glyphicon glyphicon-play"></span>
                        : <span className="glyphicon glyphicon-pause"></span>
                }
            </div>
        )
    }
}
