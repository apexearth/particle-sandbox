import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import SelectionInfo from './SelectionInfo'
import ZoomMeter from './ZoomMeter'

class Root extends React.Component {
    render() {
        return (
            <div>
                <Menu />
                <MenuButton />
                <SelectionInfo />
                <ZoomMeter />
            </div>
        )
    }
}

module.exports = Root