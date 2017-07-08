import React from 'react'

import EditMenu from './menus/EditMenu'
import SettingsMenu from './menus/SettingsMenu'
import ExploreMenu from './menus/ExploreMenu'
import EditButton from './top-buttons/EditButton'
import ExploreButton from './top-buttons/ExploreButton'
import SettingsButton from './top-buttons/SettingsButton'
import PlayPauseButton from './top-buttons/PlayPauseButton'
import ZoomMeter from './top-buttons/ZoomMeter'
import FullScreenButton from './top-buttons/FullScreenButton'
import ClearButton from './top-buttons/ClearButton'
import SelectionInfo from './SelectionInfo'
import Version from './Version'
import ShareButtons from './ShareButtons'
import Statistics from './Statistics'

class Root extends React.Component {
    render() {
        return (
            <div id="root">
                <div id="top-left">
                    <div id="gui-buttons">
                        <SettingsButton />
                        <EditButton/>
                        <ExploreButton/>
                        <PlayPauseButton />
                        <ZoomMeter />
                        <FullScreenButton />
                        <ClearButton />
                    </div>
                    <div id="menu">
                        <EditMenu />
                        <SettingsMenu />
                        <ExploreMenu />
                    </div>
                </div>
                <div id="top-right">
                    <SelectionInfo />
                </div>
                <div id="bottom-left">
                    <ShareButtons />
                    <Statistics />
                </div>
                <div id="bottom-right">
                    <Version />
                </div>
            </div>
        )
    }
}

module.exports = Root
