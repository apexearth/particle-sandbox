import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import PlayPauseButton from './PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'
import LinkOriginal from './LinkOriginal'

class Root extends React.Component {
    render() {
        return (
            <div>
                <MenuButton />
                <Menu />
                <PlayPauseButton />
                <SelectionInfo />
                <ZoomMeter />
                <LinkOriginal />
            </div>
        )
    }
}

module.exports = Root