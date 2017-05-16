import React from 'react'

const SettingInput = (settings, settingKey) => {
    console.log(settings, settingKey)
    return (
        <div className="settings-input" style={{display: 'flex'}}>
            <div>{settingKey}</div>
            <div>{settings[settingKey]}</div>
        </div>
    )
}

export default SettingInput