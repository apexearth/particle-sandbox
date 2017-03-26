import React from 'react';
import {menu} from './state';

class MenuButton extends React.Component {

    componentDidMount() {
        this.setState(menu)
        menu.subscribe(menu => {
            this.setState(menu)
        })
    }

    render() {
        return (
            <div id="menu-button"
                 onClick={menu.toggleVisible}>
                &nbsp;
            </div>
        )
    }
}

module.exports = MenuButton;