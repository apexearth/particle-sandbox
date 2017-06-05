import React from 'react'

import EditMenu from './menus/EditMenu'
import SettingsMenu from './menus/SettingsMenu'
import EditButton from './top-buttons/EditButton'
import SettingsButton from './top-buttons/SettingsButton'
import PlayPauseButton from './top-buttons/PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './top-buttons/ZoomMeter'
import LinkOriginal from './LinkOriginal'
import ShareButtons from './ShareButtons'
import Statistics from './Statistics'

class Root extends React.Component {
    render() {
        return (
            <div className="zero-size">
                <div className="zero-size">
                    <div id="gui-buttons">
                        <SettingsButton />
                        <EditButton/>
                        <PlayPauseButton />
                        <ZoomMeter />
                    </div>
                    <div id="menu">
                        <EditMenu />
                        <SettingsMenu />
                    </div>
                </div>
                <div id="top-right">
                    <SelectionInfo />
                </div>
                <LinkOriginal />
                <div id="bottom-left">
                    <ShareButtons />
                    <Statistics />
                </div>
            </div>
        )
    }
}

module.exports = Root