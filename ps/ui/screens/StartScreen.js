require('./StartScreen.less')
import React from 'react'

import state, {actions} from '../state'

class StartScreen extends React.Component {
    componentDidMount() {
        document.body.addEventListener('click', this.skip)
        document.body.addEventListener('touchdown', this.skip)

        state.ps.zoom = state.ps.scale.x = state.ps.scale.y = .0000001
        state.ps.zoom      = 1
        let tid            = setInterval(() => {
            state.ps.zoomSpeed *= 1.1
            state.ps.centerView() // Mini hack to keep centered while zooming if a user changes window size.
            if (state.ps.zoomSpeed > 10) {
                state.ps.zoomSpeed = 10
                clearInterval(tid)
                document.body.removeEventListener('click', this.skip)
                document.body.removeEventListener('touchdown', this.skip)
                actions.changeScreen('GameScreen')
            }
        }, 100)
        state.ps.zoomSpeed = .001
    }

    skip() {
        state.ps.zoomSpeed = 10
    }

    render() {
        let {location} = this.props
        return (
            <div id="start-screen-root" style={{display: state.screen === 'StartScreen' ? 'block' : 'none'}}>
            </div>
        )
    }
}

module.exports = StartScreen
