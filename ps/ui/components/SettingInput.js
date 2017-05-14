import React from 'react'

const SettingInput = (object, key) => {
    return (
        <div style={{display: 'flex'}}>
            <div>{key}</div>
            <div>{object[key]}</div>
        </div>
    )
}

export default SettingInput