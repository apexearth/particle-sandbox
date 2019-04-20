import React from 'react'
import SettingButton from './SettingButton'
import SettingInput from './SettingInput'
import Title from './Title'

const SettingsList = ({id, title, settings, settingsLogic}) => {
    if (!settings) return null
    settingsLogic = settingsLogic || {}
    const keys    = Object.keys(settings)
    const array   = keys
        .filter(key => !settingsLogic[key] || settingsLogic[key].enabled !== false)
        .map(key => {
            if (typeof settings[key] === 'function') {
                return <SettingButton settings={settings} settingsLogic={settingsLogic} settingsKey={key} key={key}/>
            } else if (settings[key].type === 'boolean') {
                return <SettingButton settings={settings} settingsLogic={settingsLogic} settingsKey={key} key={key}/>
            } else {
                return <SettingInput settings={settings} settingsLogic={settingsLogic} settingsKey={key} key={key}/>
            }
        })
    return (
        <div id={id} className="settings-list gui-window events">
            <Title>{title}</Title>
            {array}
        </div>
    )
}

export default SettingsList
