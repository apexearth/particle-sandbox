import Color from 'color'
import React from 'react'

class SettingInput extends React.Component {
    render() {
        const {settings, settingsKey} = this.props
        const setting                 = settings[settingsKey]
        const onChange                = event => {
            switch (setting.type) {
                case 'number':
                    if (/^-?\d*\.?\d+$/.test(event.target.value)) {
                        setting.value = Math.max(Math.min(Number(event.target.value), setting.max), setting.min)
                    }
                    break
                case 'hex':
                    setting.value = Math.max(Math.min(parseInt(event.target.value, 16), setting.max), setting.min)
                    break
                default:
                    setting.value = event.target.value
            }
            this.forceUpdate()
        }
        const displayValue            = value => {
            switch (setting.type) {
                case 'number':
                    return Number(value)
                case 'hex':
                    return value.toString(16)
                case 'color':
                    return Color(value).hex()
                default:
                    return value
            }
        }
        let inputProperties           = {
            type : setting.type,
            value: displayValue(setting.value),
            onChange
        }
        if (setting.type === 'number') {
            inputProperties.step = (setting.max - setting.min) / 100
        }
        return (
            <div className="settings-input">
                <div>{settingsKey}</div>
                <input {...inputProperties} />
            </div>
        )
    }
}

export default SettingInput
