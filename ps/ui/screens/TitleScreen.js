require('./TitleScreen.less')
import React from 'react'

import state, {actions} from '../state'

class TitleScreen extends React.Component {
    render() {
        let {location} = this.props
        let resume     = null
        if (state.ps) {
            resume = (
                <div onClick={() => actions.resumeGame()}>
                    Resume
                </div>
            )
        }
        return (
            <div id="title-screen-root" style={{display: state.screen === 'TitleScreen' ? 'block' : 'none'}}>
                <div id="title-screen-title">
                    Particle Sandbox
                </div>
                <div id="title-screen-buttons">
                    {resume}
                    <div onClick={actions.startSandbox}>
                        Sandbox
                    </div>
                </div>
                <div id="title-screen-ad">
                </div>
            </div>
        )
    }
}

module.exports = TitleScreen
