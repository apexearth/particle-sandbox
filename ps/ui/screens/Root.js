import React from 'react'

import state from '../state'

import StartScreen from './StartScreen'
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
                <StartScreen location={location}/>
                <GameScreen location={location}/>
            </div>
        )
    }
}

module.exports = Root
