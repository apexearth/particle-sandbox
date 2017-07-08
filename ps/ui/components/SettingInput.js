import React from 'react'

const SettingInput = ({settings, settingsKey}) => {
    return (
        <div className="settings-input">
            <div>{settingsKey}</div>
            <input
                type="number"
                defaultValue={settings[settingsKey]}
                onChange={event => settings[settingsKey] = Number(event.target.value)}
            />
        </div>
    )
}

export default SettingInput
