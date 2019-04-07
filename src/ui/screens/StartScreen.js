import React from 'react'
import state from '../state'
import actions from '../state/actions'

import './StartScreen.scss'

export default class StartScreen extends React.Component {
    componentDidMount() {
        this.initZoom()
        setTimeout(() => this.beginZoom(), 500)
    }

    initZoom() {
        document.body.addEventListener('click', this.skip)
        document.body.addEventListener('touchdown', this.skip)

        state.ps.scale.x   = state.ps.scale.y = .0000001
        state.ps.zoomSpeed = 0
        state.ps.zoom      = 1
    }

    beginZoom() {
        let tid            = setInterval(() => {
            state.ps.zoomSpeed *= 1.1
            state.ps.centerView() // Mini hack to keep centered while zooming if a user changes window size.
            if (state.ps.zoomSpeed > 10) {
                state.ps.zoomSpeed = 10
                clearInterval(tid)
                document.body.removeEventListener('click', this.skip)
                document.body.removeEventListener('touchdown', this.skip)
                actions.changeScreen('GameScreen')
                state.ps.paused = state.androidOnWeb
                state.ps.clearRenderer()
            }
        }, 100)
        state.ps.zoomSpeed = .001
    }

    skip() {
        state.ps.zoomSpeed = 10
    }

    render() {
        return (
            <div id="start-screen-root" style={{display: state.screen === 'StartScreen' ? 'block' : 'none'}}>
            </div>
        )
    }
}
