import React from 'react'

import state from './state'

import TitleScreen from './TitleScreen'
import GameScreen from './GameScreen'

class Root extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: state.screen
        }
        state.on('screen', () => this.setState({screen: state.screen}))
    }

    render() {
        let {location} = this.props
        let screen     = null
        if (this.state.screen === "GameScreen") {
            screen = <GameScreen location={location}/>
        } else if (this.state.screen === "TitleScreen") {
            screen = <TitleScreen location={location}/>
        }
        return (
            <div id="root">
                {screen}
            </div>
        )
    }
}

module.exports = Root
