import React from 'react'
import SettingInput from './SettingInput'
import Title from './Title'

const SettingsList = ({title, settings}) => {
    if (!settings) return null

    const keys  = Object.keys(settings)
    const array = keys
        .map(key => <SettingInput settings={settings} settingsKey={key} key={key}/>)
    return (
        <div className="settings-list gui-window">
            <Title>{title}</Title>
            {array}
        </div>
    )
}

export default SettingsList
