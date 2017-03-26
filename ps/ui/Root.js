import React from 'react';

import Menu from './Menu';
import MenuButton from './MenuButton';

class Root extends React.Component {

    render() {
        return (
            <div>
                <Menu />
                <MenuButton />
            </div>
        )
    }
}

module.exports = Root;