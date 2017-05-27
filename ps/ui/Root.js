import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import SettingsButton from './SettingsButton'
import PlayPauseButton from './PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'
import LinkOriginal from './LinkOriginal'
import ShareButtons from './ShareButtons'

class Root extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div id="gui-buttons">
                        <SettingsButton />
                        <MenuButton />
                        <PlayPauseButton />
                        <ZoomMeter />
                    </div>
                    <Menu />
                </div>
                <SelectionInfo />
                <LinkOriginal />
                <ShareButtons />
            </div>
        )
    }
}

module.exports = Root