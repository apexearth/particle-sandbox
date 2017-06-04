import React from 'react'

import EditMenu from './EditMenu'
import SettingsMenu from './SettingsMenu'
import MenuButton from './MenuButton'
import SettingsButton from './SettingsButton'
import PlayPauseButton from './PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'
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
                        <MenuButton />
                        <PlayPauseButton />
                        <ZoomMeter />
                    </div>
                    <EditMenu />
                    <SettingsMenu />
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