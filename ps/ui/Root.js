import React from 'react'

import Menu from './Menu'
import MenuButton from './MenuButton'
import SelectionInfo from './SelectionInfo'
import Tools from './Tools'

class Root extends React.Component {
    render() {
        return (
            <div>
                <Menu />
                <MenuButton />
                <SelectionInfo />
                <Tools />
            </div>
        )
    }
}

module.exports = Root