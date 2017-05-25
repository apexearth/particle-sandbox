import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import PlayPauseButton from './PlayPauseButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'
import LinkOriginal from './LinkOriginal'
import ShareButtons from './ShareButtons'

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
                <ShareButtons />
            </div>
        )
    }
}

module.exports = Root