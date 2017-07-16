import React from 'react'

import state from '../state'

import TitleScreen from './TitleScreen'
import GameScreen from './GameScreen'

class Root extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: state.screen
        }
        state.on('screen', screen => this.setState({screen}))
    }

    render() {
        let {location} = this.props
        return (
            <div id="root">
                <TitleScreen location={location}/>
                <GameScreen location={location}/>
            </div>
        )
    }
}

module.exports = Root
