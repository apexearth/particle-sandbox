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
import {AndroidAppNotification} from '../components'

import state from '../state'

class GameScreen extends React.Component {
    componentWillMount() {
        this.setState({
            showAndroidAppNotification: state.androidOnWeb,
            showFullscreenButton      : state.deploymentType === "web" && !state.ios,
            showReloadButton          : state.deploymentType === "standalone",
            showShareButtons          : state.deploymentType === "web",
        })
    }

    componentWillUnmount() {
        let timeoutsCount = setTimeout(() => undefined, 1000)
        for (let i = 0; i < timeoutsCount; i++) clearTimeout(i)
    }

    render() {
        let {ps} = state
        if (!ps) return null

        return (
            <div id="game-screen-root" style={{display: state.screen === 'GameScreen' ? 'block' : 'none'}}>
                <div id="top-left">
                    <div id="gui-buttons">
                        <EditButton/>
                        <ExploreButton/>
                        <SettingsButton/>
                        <PlayPauseButton/>
                        <ZoomMeter/>
                        {this.state.showFullscreenButton && <FullScreenButton/>}
                        <ClearButton/>
                        {this.state.showReloadButton && <ReloadButton/>}
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
                    {this.state.showShareButtons && <ShareButtons/>}
                    <Statistics/>
                </div>
                <div id="bottom-right">
                    <Version/>
                </div>
                {this.state.showAndroidAppNotification && <AndroidAppNotification onClick={() => {
                    this.setState({showAndroidAppNotification: false})
                    ps.paused = false
                }}/>}
            </div>
        )
    }
}

module.exports = GameScreen

