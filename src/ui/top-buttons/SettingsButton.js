import React from 'react'
import state from '../state'
const {settings} = state

export default class SettingsButton extends React.Component {

    componentDidMount() {
        this.setState(settings)
        settings.subscribe(settings => this.setState(settings))
    }

    render() {
        let className = "square-button"
        if (settings.visible()) {
            className += " square-button-active"
        }
        return (
            <div className={className}
                 onClick={settings.toggleVisible}>
                <span className="glyphicon glyphicon-cog"/>
            </div>
        )
    }
}
