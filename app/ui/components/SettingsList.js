import React from 'react'
import SettingInput from './SettingInput'
import Title from './Title'

const SettingsList = ({id, title, settings}) => {
    if (!settings) return null

    const keys  = Object.keys(settings)
    const array = keys
        .map(key => <SettingInput settings={settings} settingsKey={key} key={key}/>)
    return (
        <div id={id} className="settings-list gui-window events">
            <Title>{title}</Title>
            {array}
        </div>
    )
}

export default SettingsList
