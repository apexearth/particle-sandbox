import React from 'react'
import SettingInput from './SettingInput'

const SettingsList = ({object}) => {
    const keys  = Object.keys(object)
    const array = keys.map(key => <SettingInput object={object} key={key}/>)
    return (
        <div className="settings-list">
            {array}
        </div>
    )
}

export default SettingsList
