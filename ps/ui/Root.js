import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import PlayPauseButton from './PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'

class Root extends React.Component {
    render() {
        return (
            <div>
                <Menu />
                <MenuButton />
                <PlayPauseButton />
                <SelectionInfo />
                <ZoomMeter />
            </div>
        )
    }
}

module.exports = Root