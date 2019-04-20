import React from 'react'
import state from '../state'

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

    set setting(val) {
        this.props.settings[this.props.settingsKey] = val
    }

    get enabled() {
        return this.props.settingsLogic[this.props.settingsKey]
    }

    get on() {
        return this.setting.value
    }

    get className() {
        return this.on ? 'settings-button settings-button-active' : 'settings-button'
    }

    onClick() {
        if (typeof this.setting === 'function') {
            this.setting()
        } else {
            this.setting.value = !this.setting.value
        }
        state.notify()
    }

    render() {
        let text = this.name
        if (typeof this.setting !== 'function') {
            text += this.setting.value ? ' (enabled)' : ' (disabled)'
        }
        console.log(text)
        return (
            <div className={this.className}>
                <button onClick={this.onClick}>{text}</button>
            </div>
        )
    }
}

export default SettingButton
