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
            </div>
        )
    }
}

module.exports = GameScreen
