import React from 'react'
import {settings} from './state'

class SettingsButton extends React.Component {

    componentDidMount() {
        this.setState(settings)
        settings.subscribe(settings => {
            this.setState(settings)
        })
    }

    render() {
        return (
            <div id="settings-button"
                 onClick={settings.toggleVisible}>
                <span className="glyphicon glyphicon-cog"/>
            </div>
        )
    }
}

module.exports = SettingsButton