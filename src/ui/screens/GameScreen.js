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
    ScreenshotButton,
    ClearButton,
    ReloadButton,
} from '../top-buttons'
import SelectionInfo from '../SelectionInfo'
import Version from '../Version'
import ShareButtons from '../ShareButtons'
import Statistics from '../Statistics'
import ScreenshotDisplay from './ScreenshotDisplay'
import {AndroidAppNotification} from '../components'

import state from '../state'

export default class GameScreen extends React.Component {

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
                        {state.showFullscreenButton && <FullScreenButton/>}
                        {state.showScreenshotButton && <ScreenshotButton/>}
                        <ClearButton/>
                        {state.showReloadButton && <ReloadButton/>}
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
                    {state.showShareButtons && <ShareButtons/>}
                    <Statistics/>
                </div>
                <div id="bottom-right">
                    <Version/>
                </div>
                <ScreenshotDisplay/>
                {state.showAndroidAppNotification && <AndroidAppNotification onClick={() => {
                    state.showAndroidAppNotification = false
                    ps.paused                        = false
                    this.forceUpdate()
                }}/>}
            </div>
        )
    }
}
