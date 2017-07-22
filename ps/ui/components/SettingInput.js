import React from 'react'

class SettingInput extends React.Component {
    render() {
        const {settings, settingsKey} = this.props
        const onChange = event => {
            if (/^-?\d*\.?\d+$/.test(event.target.value)) {
                settings[settingsKey].value = Math.max(Math.min(Number(event.target.value), settings[settingsKey].max), settings[settingsKey].min)
                this.forceUpdate()
            }
        }
        return (
            <div className="settings-input">
                <div>{settingsKey}</div>
                <input
                    type="number"
                    value={settings[settingsKey].value}
                    onChange={onChange}
                />
            </div>
        )
    }
}

export default SettingInput
