import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import SelectionInfo from './SelectionInfo'

class Root extends React.Component {

    render() {
        return (
            <div>
                <Menu />
                <MenuButton />
                <SelectionInfo />
            </div>
        )
    }
}

module.exports = Root