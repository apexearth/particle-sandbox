import React from 'react'

import {
    EditMenu,
    SettingsMenu,
    ExploreMenu
} from '../menus/'
import {
    EditButton,
    ExploreButton,
    SettingsButton,
    PlayPauseButton,
    ZoomMeter,
    FullScreenButton,
    ClearButton,
    ReloadButton,
} from '../top-buttons'
import SelectionInfo from '../SelectionInfo'
import Version from '../Version'
import ShareButtons from '../ShareButtons'
import Statistics from '../Statistics'

import state from '../state'

class GameScreen extends React.Component {
    componentWillMount() {
        this.setState({
            showAndroidNotification: true || state.android && state.deploymentType === 'web'
        })
    }

    componentWillUnmount() {
        let timeoutsCount = setTimeout(() => undefined, 1000)
        for (let i = 0; i < timeoutsCount; i++) clearTimeout(i)
    }

    render() {
        let {ps} = state
        if (!ps) return null

        const AndroidNotification = () => {
            if (!this.state.showAndroidNotification) {
                return null
            }
            return (
                <div className="gui-center">
                    <div className="gui-notification">
                        <p>Did you know there is an Android version available on the Play Store?</p>
                        <a href="https://play.google.com/store/apps/details?id=com.particlesandbox">Install</a>
                        <a onClick={() => this.setState({
                            showAndroidNotification: false
                        })}>Skip</a>
                    </div>
                </div>
            )
        }

        return (
            <div id="game-screen-root" style={{display: state.screen === 'GameScreen' ? 'block' : 'none'}}>
                <div id="top-left">
                    <div id="gui-buttons">
                        <EditButton/>
                        <ExploreButton/>
                        <SettingsButton/>
                        <PlayPauseButton/>
                        <ZoomMeter/>
                        {state.deploymentType === "standalone" ? null : <FullScreenButton/>}
                        <ClearButton/>
                        {state.deploymentType === "standalone" ? <ReloadButton/> : null}
                    </div>
                    <div id="menu">
                        <EditMenu/>
                        <SettingsMenu/>
                        <ExploreMenu/>
                    </div>
                </div>
                <div id="top-right">
                    <SelectionInfo/>
                </div>
                <div id="bottom-left">
                    {state.deploymentType === "standalone" ? null : <ShareButtons/>}
                    <Statistics/>
                </div>
                <div id="bottom-right">
                    <Version/>
                </div>
                <AndroidNotification />
            </div>
        )
    }
}

module.exports = GameScreen

