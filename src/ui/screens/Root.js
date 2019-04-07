import React from 'react'

import state from '../state'

import IntroductionScreen from './IntroductionScreen'
import StartScreen from './StartScreen'
import GameScreen from './GameScreen'
import AdOverlay from './AdOverlay'

export default class Root extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: state.screen,
        }
        state.on('screen', screen => this.setState({screen}))
    }

    get introduction() {
        return this.state.screen === 'GameScreen' && localStorage.getItem('skip-introduction') !== true
    }

    render() {
        let {location}   = this.props
        let introduction = (this.introduction ? <IntroductionScreen location={location}/> : null)
        return (
            <div id="root">
                <StartScreen location={location}/>
                <GameScreen location={location}/>
                {introduction}
                <AdOverlay/>
            </div>
        )
    }
}
