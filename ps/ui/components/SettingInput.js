import React from 'react'

const SettingInput = ({settings, settingsKey}) => {
    return (
        <div className="settings-input" style={{display: 'flex'}}>
            <div>{settingsKey}</div>
            <div>{settings[settingsKey]}</div>
        </div>
    )
}

export default SettingInput