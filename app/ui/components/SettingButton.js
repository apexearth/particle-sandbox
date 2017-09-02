import React from 'react'

class SettingButton extends React.Component {
    constructor(...args) {
        super(...args)
        this.onClick = this.onClick.bind(this)
    }

    get name() {
        return this.props.settingsKey
    }

    get setting() {
        return this.props.settings[this.props.settingsKey]
    }

    onClick() {
        this.setting()
    }

    render() {

        return (
            <div className="settings-button">
                <button onClick={this.onClick}>{this.name}</button>
            </div>
        )
    }
}

export default SettingButton
