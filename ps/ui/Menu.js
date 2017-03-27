import React from 'react';
import {menu} from './state';
class Menu extends React.Component {

    componentDidMount() {
        this.setState(menu)
        menu.subscribe(menu => {
            this.setState(menu)
        })
    }

    render() {
        if (!menu.visible)  return null;
        return (
            <div id="menu">
                <div id="menu-list">
                    <div>Settings</div>
                    <div>Settings</div>
                    <div>Settings</div>
                    <div>Settings</div>
                </div>

            </div>
        )
    }
}

module.exports = Menu;