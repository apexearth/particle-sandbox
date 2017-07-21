import React from 'react'

const SettingInput = ({settings, settingsKey}) => {
    const onChange = event => {
        if(/^-?\d+\.?\d*$/.test(event.target.value)) {
            settings[settingsKey] = Number(event.target.value)
        }
    }
    return (
        <div className="settings-input">
            <div>{settingsKey}</div>
            <input
                type="number"
                defaultValue={settings[settingsKey]}
                onChange={onChange}
            />
        </div>
    )
}

export default SettingInput

