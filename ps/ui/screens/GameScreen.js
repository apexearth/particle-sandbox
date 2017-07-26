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
            showAndroidNotification: state.androidOnWeb
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
                <div className="gui-popup">
                    <div className="gui-notification">
                        <p>Did you know there is an Android version available on the Play Store?</p>
                        <div className="gui-text-button">
                            <a href="https://play.google.com/store/apps/details?id=com.particlesandbox">View</a>
                        </div>
                        <div className="gui-text-button-neutral">
                            <a onClick={() => {
                                this.setState({
                                    showAndroidNotification: false
                                })
                                ps.paused = false
                            }}>Skip</a>
                        </div>
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
                <AndroidNotification/>
            </div>
        )
    }
}

module.exports = GameScreen

