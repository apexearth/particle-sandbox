import React from 'react'
import SettingInput from './SettingInput'
import Title from './Title'

const SettingsList = ({title, object}) => {
    const keys  = Object.keys(object)
    const array = keys.map(key => <SettingInput object={object} key={key}/>)
    return (
        <div className="settings-list">
            <Title>{title}</Title>
            {array}
        </div>
    )
}

export default SettingsList
