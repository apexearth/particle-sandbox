import React from 'react'

const SettingInput = ({settings, settingsKey}) => {
    return (
        <div className="settings-input" style={{display: 'flex'}}>
            <div>{settingsKey}</div>
            <input
                type="text"
                defaultValue={settings[settingsKey]}
                onChange={event => settings[settingsKey] = Number(event.target.value)}
            />
        </div>
    )
}

export default SettingInput
